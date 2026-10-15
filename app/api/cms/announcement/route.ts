import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';
import { requireHydrated } from '@/lib/cms-request';

export async function GET(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const isRaw = req.nextUrl.searchParams.get('all') === 'true';
  if (isRaw) {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
  }
  const banner = isRaw ? store.getRawAnnouncement() : store.getAnnouncement();
  return NextResponse.json({ announcement: banner });
}

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const updated = store.updateAnnouncement(body);
    await persistStore();
    return NextResponse.json({ success: true, announcement: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update announcement';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  return POST(req);
}
