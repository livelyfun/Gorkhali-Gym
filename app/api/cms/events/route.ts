import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  const events = store.getEvents(!adminMode);
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }
    const event = store.saveEvent(body);
    return NextResponse.json({ success: true, event });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

  const deleted = store.deleteEvent(id);
  return NextResponse.json({ success: deleted });
}
