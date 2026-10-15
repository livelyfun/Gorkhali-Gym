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
  }
  const categoryParam = req.nextUrl.searchParams.get('category');
  const category = categoryParam === 'service' || categoryParam === 'training' ? categoryParam : undefined;

  const programs = store.getPrograms(!adminMode, category);
  return NextResponse.json({ programs });
}

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }
    const program = store.saveProgram(body);
    await persistStore();
    return NextResponse.json({ success: true, program });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save program';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Program ID required' }, { status: 400 });

  const deleted = store.deleteProgram(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
