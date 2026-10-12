import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const navigation = store.getNavigation();
  return NextResponse.json({ navigation });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    if (!body.label || !body.href) {
      return NextResponse.json({ error: 'Label and destination URL (href) are required' }, { status: 400 });
    }
    const item = store.saveNavigationItem(body);
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save navigation item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Navigation item ID is required' }, { status: 400 });

  const deleted = store.deleteNavigationItem(id);
  return NextResponse.json({ success: deleted });
}
