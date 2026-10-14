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
  const trainers = store.getTrainers(!adminMode);
  return NextResponse.json({ trainers });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.name || !body.role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }
    const trainer = store.saveTrainer(body);
    await persistStore();
    return NextResponse.json({ success: true, trainer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save trainer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Trainer ID required' }, { status: 400 });

  const deleted = store.deleteTrainer(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
