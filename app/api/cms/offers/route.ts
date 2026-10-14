import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  if (adminMode) {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
  }
  const activeOnly = req.nextUrl.searchParams.get('active') === 'true';
  const offers = store.getOffers(!adminMode, activeOnly);
  return NextResponse.json({ offers });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }
    const offer = store.saveOffer(body);
    await persistStore();
    return NextResponse.json({ success: true, offer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save offer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Offer ID required' }, { status: 400 });

  const deleted = store.deleteOffer(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
