import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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

// Development bootstrap admin account (gorkhagym / gymgorkha)
const admins: StoredAdmin[] = [
  {
    id: 'admin-seed-1',
    username: 'gorkhagym',
    name: 'Gorkhali Gym Admin',
    role: 'superadmin',
    passwordHash: bcrypt.hashSync('gymgorkha', 10),
    createdAt: new Date().toISOString(),
  },
];

const sessions = new Map<string, { adminId: string; expiresAt: number }>();

const SESSION_COOKIE_NAME = 'gorkhali_admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
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

  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  sessions.set(tokenHash, { adminId: admin.id, expiresAt });

  return {
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    },
    token,
  };
}

export async function verifyCurrentSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);
    const session = sessions.get(tokenHash);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      sessions.delete(tokenHash);
      return null;
    }

    const admin = admins.find((a) => a.id === session.adminId);
    if (!admin) return null;

    return {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    };
  } catch {
    return null;
  }
}

export async function revokeCurrentSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const tokenHash = hashToken(token);
      sessions.delete(tokenHash);
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
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
    user: {
      id: newAdmin.id,
      username: newAdmin.username,
      name: newAdmin.name,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt,
    },
  };
}

export function listAdminUsers(currentUser: AdminUser): AdminUser[] {
  if (currentUser.role !== 'superadmin') return [];
  return admins.map((a) => ({
    id: a.id,
    username: a.username,
    name: a.name,
    role: a.role,
    createdAt: a.createdAt,
  }));
}

export async function requireAuth(req: NextRequest): Promise<AdminUser | NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  const tokenHash = hashToken(token);
  const session = sessions.get(tokenHash);
  if (!session || Date.now() > session.expiresAt) {
    return NextResponse.json({ error: 'Unauthorized: Session expired or invalid' }, { status: 401 });
  }

  const admin = admins.find((a) => a.id === session.adminId);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
  }

  return {
    id: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role,
    createdAt: admin.createdAt,
  };
}
