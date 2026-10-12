import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  const posts = store.getBlog(!adminMode);
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }
    const post = store.saveBlogPost(body);
    return NextResponse.json({ success: true, post });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save blog post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 });

  const deleted = store.deleteBlogPost(id);
  return NextResponse.json({ success: deleted });
}
