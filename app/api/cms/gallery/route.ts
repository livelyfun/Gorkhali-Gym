import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  const category = req.nextUrl.searchParams.get('category') || undefined;
  const orientation = req.nextUrl.searchParams.get('orientation') || undefined;
  const gallery = store.getGallery(!adminMode, category, orientation);
  return NextResponse.json({ gallery });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: 'Title and imageUrl are required' }, { status: 400 });
    }
    const item = store.saveGalleryItem(body);
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save gallery item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Gallery item ID required' }, { status: 400 });

  const deleted = store.deleteGalleryItem(id);
  return NextResponse.json({ success: deleted });
}
