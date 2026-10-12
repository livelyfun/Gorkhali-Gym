import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const authResult = await authenticateAdmin(username, password);
    if (!authResult) {
      return NextResponse.json({ error: 'Invalid credentials. Access denied.' }, { status: 401 });
    }

    const res = NextResponse.json({
      success: true,
      user: authResult.user,
      message: 'Logged in successfully',
    });

    res.cookies.set({
      name: 'gorkhali_admin_session',
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown login error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
