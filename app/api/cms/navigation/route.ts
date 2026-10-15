import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';
import { requireHydrated } from '@/lib/cms-request';

export async function GET(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  if (adminMode) {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    return NextResponse.json({ navigation: store.getAllNavigation() });
  }
  // Public read: only published navigation items.
  return NextResponse.json({ navigation: store.getNavigation(true) });
}

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.label || !body.href) {
      return NextResponse.json({ error: 'Label and destination URL (href) are required' }, { status: 400 });
    }
    const item = store.saveNavigationItem(body);
    await persistStore();
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save navigation item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Navigation item ID is required' }, { status: 400 });

  const deleted = store.deleteNavigationItem(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
