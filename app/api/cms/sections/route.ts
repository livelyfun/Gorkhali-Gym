import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page');
  const sections = page ? store.getSections(page) : store.getAllSections();
  return NextResponse.json({ sections });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.heading || !body.sectionKey) {
      return NextResponse.json({ error: 'Section heading and key are required' }, { status: 400 });
    }
    const section = store.saveSection(body);
    return NextResponse.json({ success: true, section });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save section';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });

  const deleted = store.deleteSection(id);
  return NextResponse.json({ success: deleted });
}
