import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getSeedCredentials } from './admin-credentials';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

interface StoredAdmin extends AdminUser {
  passwordHash: string;
}

// Bootstrap admin account is provisioned from ADMIN_SEED_USERNAME /
// ADMIN_SEED_PASSWORD (production) or the gitignored credentials.md (development).
// Credentials are never hardcoded in source.
//
// The admin list is stored on globalThis so every route handler / server
// component in the same Node process shares one instance. (Next.js compiles
// each route as a separate module graph, so a plain module-level array would be
// duplicated per route.)
const globalForAuth = globalThis as unknown as { __gorkhaliAdmins?: StoredAdmin[] };

function buildSeedAdmin(): StoredAdmin | null {
  const seedCredentials = getSeedCredentials();
  if (!seedCredentials) return null;
  return {
    id: 'admin-seed-1',
    username: seedCredentials.username,
    name: 'Gorkhali Gym Admin',
    role: 'superadmin',
    passwordHash: bcrypt.hashSync(seedCredentials.password, 10),
    createdAt: new Date().toISOString(),
  };
}

const admins: StoredAdmin[] =
  globalForAuth.__gorkhaliAdmins ??
  (globalForAuth.__gorkhaliAdmins = (() => {
    const seed = buildSeedAdmin();
    return seed ? [seed] : [];
  })());

const SESSION_COOKIE_NAME = 'gorkhali_admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Session tokens are stateless and HMAC-signed so they can be verified in any
// route handler or serverless instance without shared server memory.
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() ||
  (() => {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[auth] ADMIN_SESSION_SECRET is not set. Falling back to a derived secret; set it in production so sessions remain valid across deploys and instances.'
      );
    }
    const seed = getSeedCredentials();
    return crypto
      .createHash('sha256')
      .update(`gorkhali-session:${seed?.username ?? 'anon'}:${seed?.password ?? 'none'}`)
      .digest('hex');
  })();

interface SessionPayload {
  sub: string;
  exp: number;
}

function signToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const idx = token.lastIndexOf('.');
  if (idx <= 0) return null;
  const body = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  if (sig.length !== expected.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
    if (!payload?.sub || typeof payload.exp !== 'number') return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function toAdminUser(admin: StoredAdmin): AdminUser {
  return {
    id: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role,
    createdAt: admin.createdAt,
  };
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function authenticateAdmin(
  username: string,
  plainPassword: string
): Promise<{ user: AdminUser; token: string } | null> {
  const admin = admins.find((a) => a.username.toLowerCase() === username.trim().toLowerCase());
  if (!admin) return null;

  const valid = await bcrypt.compare(plainPassword, admin.passwordHash);
  if (!valid) return null;

  const token = signToken({ sub: admin.id, exp: Date.now() + SESSION_DURATION_MS });

  return { user: toAdminUser(admin), token };
}

export async function verifyCurrentSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = verifyToken(token);
    if (!payload) return null;

    const admin = admins.find((a) => a.id === payload.sub);
    if (!admin) return null;

    return toAdminUser(admin);
  } catch {
    return null;
  }
}

export async function revokeCurrentSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Ignore cookie store errors during logout
  }
}

export async function changeAdminPassword(
  adminId: string,
  oldPass: string,
  newPass: string
): Promise<{ success: boolean; message: string }> {
  const admin = admins.find((a) => a.id === adminId);
  if (!admin) return { success: false, message: 'Admin not found' };

  const valid = await bcrypt.compare(oldPass, admin.passwordHash);
  if (!valid) return { success: false, message: 'Current password does not match' };

  if (newPass.length < 8) {
    return { success: false, message: 'New password must be at least 8 characters long' };
  }

  admin.passwordHash = await bcrypt.hash(newPass, 10);
  return { success: true, message: 'Password updated successfully' };
}

export async function createAdminUser(
  currentUser: AdminUser,
  newUsername: string,
  newName: string,
  newPass: string,
  role: 'superadmin' | 'admin' = 'admin'
): Promise<{ success: boolean; message: string; user?: AdminUser }> {
  if (currentUser.role !== 'superadmin') {
    return { success: false, message: 'Only superadmins can create new administrators' };
  }

  const cleanUser = newUsername.trim().toLowerCase();
  if (admins.some((a) => a.username.toLowerCase() === cleanUser)) {
    return { success: false, message: 'Username is already in use' };
  }

  if (newPass.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long' };
  }

  const newAdmin: StoredAdmin = {
    id: `admin-${Date.now()}`,
    username: cleanUser,
    name: newName.trim(),
    role,
    passwordHash: await bcrypt.hash(newPass, 10),
    createdAt: new Date().toISOString(),
  };

  admins.push(newAdmin);

  return {
    success: true,
    message: 'Admin account created successfully',
    user: toAdminUser(newAdmin),
  };
}

export function listAdminUsers(currentUser: AdminUser): AdminUser[] {
  if (currentUser.role !== 'superadmin') return [];
  return admins.map(toAdminUser);
}

export async function requireAuth(req: NextRequest): Promise<AdminUser | NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  const admin = admins.find((a) => a.id === payload.sub);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
  }

  return toAdminUser(admin);
}
