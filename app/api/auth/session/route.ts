import { NextResponse } from 'next/server';
import { verifyCurrentSession } from '@/lib/auth';
import { isDbConfigured } from '@/lib/prisma';

export async function GET() {
  const user = await verifyCurrentSession();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user,
    dbConfigured: isDbConfigured,
  });
}
