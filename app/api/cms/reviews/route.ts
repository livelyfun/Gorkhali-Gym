import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';
import { requireHydrated } from '@/lib/cms-request';

export async function GET(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  const filter = (req.nextUrl.searchParams.get('filter') as 'all' | 'pending' | 'published') || undefined;

  // Draft/pending data requires admin auth (moderation queue and unpublished reviews).
  if (adminMode || filter === 'pending' || filter === 'all') {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
  }

  const reviews = store.getReviews(!adminMode, filter);
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.author || !body.previewText) {
      return NextResponse.json({ error: 'Author and review text are required' }, { status: 400 });
    }
    const review = store.saveReview(body);
    await persistStore();
    return NextResponse.json({ success: true, review });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save review';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 });

  const deleted = store.deleteReview(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
