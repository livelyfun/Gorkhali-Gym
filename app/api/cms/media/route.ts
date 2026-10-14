import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const assets = store.getMediaAssets();
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.url) {
      return NextResponse.json({ error: 'Asset URL is required' }, { status: 400 });
    }
    const asset = store.saveMediaAsset(body);
    await persistStore();
    return NextResponse.json({ success: true, asset });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save media metadata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });

  const result = store.deleteMediaAsset(id);
  await persistStore();
  if (!result.success) {
    return NextResponse.json(
      { error: result.message || 'Cannot delete media asset' },
      { status: result.inUse ? 409 : 400 }
    );
  }

  return NextResponse.json({ success: true });
}
