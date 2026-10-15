import { NextResponse } from 'next/server';
import { ensureHydrated } from './store-persistence';

/**
 * Guarantees the in-memory store reflects the persisted CMS snapshot before a
 * route reads from it. Returns a 503 response when authoritative data cannot be
 * loaded, so callers never serve (or persist) seeded defaults as if they were
 * database content. Returns null when it is safe to proceed.
 */
export async function requireHydrated(): Promise<NextResponse | null> {
  const result = await ensureHydrated();
  if (!result.ready) {
    return NextResponse.json(
      { error: 'CMS data is temporarily unavailable. Please retry.' },
      { status: 503 },
    );
  }
  return null;
}
