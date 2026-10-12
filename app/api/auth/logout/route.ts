import { NextResponse } from 'next/server';
import { revokeCurrentSession } from '@/lib/auth';

export async function POST() {
  await revokeCurrentSession();
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  res.cookies.set({
    name: 'gorkhali_admin_session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
