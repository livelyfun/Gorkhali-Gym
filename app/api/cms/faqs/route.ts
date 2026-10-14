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
  const faqs = store.getFaqs(!adminMode);
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }
    const faq = store.saveFaq(body);
    await persistStore();
    return NextResponse.json({ success: true, faq });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save FAQ';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'FAQ ID required' }, { status: 400 });

  const deleted = store.deleteFaq(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
