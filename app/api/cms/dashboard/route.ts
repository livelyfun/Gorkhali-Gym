import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { requireAuth } from '@/lib/auth';
import { requireHydrated } from '@/lib/cms-request';

export async function GET(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const stats = store.getDashboardStats();
  return NextResponse.json(stats);
}
