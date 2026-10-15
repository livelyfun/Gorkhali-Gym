import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';
import { requireHydrated } from '@/lib/cms-request';

export async function GET() {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const referral = store.getReferralProgram();
  return NextResponse.json({ referral });
}

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const updated = store.updateReferralProgram(body);
    await persistStore();
    return NextResponse.json({ success: true, referral: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update referral program';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  return POST(req);
}
