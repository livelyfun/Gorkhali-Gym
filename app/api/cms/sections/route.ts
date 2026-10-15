import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';
import { requireHydrated } from '@/lib/cms-request';

export async function GET(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  const page = req.nextUrl.searchParams.get('page');

  // Admin/draft read: all sections including hidden ones.
  if (adminMode || !page) {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    return NextResponse.json({ sections: store.getAllSections() });
  }

  // Public read: only visible sections for the requested page.
  return NextResponse.json({ sections: store.getSections(page, true) });
}

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.heading || !body.sectionKey) {
      return NextResponse.json({ error: 'Section heading and key are required' }, { status: 400 });
    }
    const section = store.saveSection(body);
    await persistStore();
    return NextResponse.json({ success: true, section });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save section';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });

  const deleted = store.deleteSection(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
