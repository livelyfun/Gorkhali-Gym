import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const settings = store.getSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const updated = store.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
