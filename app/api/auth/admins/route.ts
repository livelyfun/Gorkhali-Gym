import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, listAdminUsers, createAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  if (authResult.role !== 'superadmin') {
    return NextResponse.json({ error: 'Permission denied: superadmin required' }, { status: 403 });
  }

  const admins = listAdminUsers(authResult);
  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  if (authResult.role !== 'superadmin') {
    return NextResponse.json({ error: 'Permission denied: superadmin required' }, { status: 403 });
  }

  try {
    const { username, name, password, role } = await req.json();
    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Username, name, and password are required' }, { status: 400 });
    }

    const res = await createAdminUser(authResult, username, name, password, role || 'admin');
    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: res.user, message: res.message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create admin';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
