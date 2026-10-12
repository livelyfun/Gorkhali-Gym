import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, changeAdminPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    const res = await changeAdminPassword(authResult.id, currentPassword, newPassword);
    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: res.message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to change password';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
