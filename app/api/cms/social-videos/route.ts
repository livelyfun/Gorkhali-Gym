import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';
import { validateSocialVideo } from '@/lib/social-video';
import { requireHydrated } from '@/lib/cms-request';

const FB_RESOLVE_TIMEOUT_MS = 6000;

/**
 * Resolve a Facebook share link to its canonical video URL by following the
 * server-side redirect, then derive the official embed. Returns null if the
 * link cannot be resolved (the client then falls back to an external link).
 */
async function resolveFacebookShareEmbed(shareUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FB_RESOLVE_TIMEOUT_MS);
  try {
    // Facebook responds with the canonical redirect for a neutral user agent;
    // browser-like UAs get rejected. Read the Location header directly so we
    // never land on a login wall.
    const res = await fetch(shareUrl, {
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'User-Agent': 'curl/8.5.0', Accept: '*/*' },
    });
    const location = res.headers.get('location');
    if (!location) return null;
    let canonical: string;
    try {
      canonical = new URL(location, shareUrl).toString();
    } catch {
      return null;
    }
    const validation = validateSocialVideo(canonical);
    if (validation.ok && validation.platform === 'facebook' && validation.embedUrl) {
      return validation.embedUrl;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const adminMode = req.nextUrl.searchParams.get('all') === 'true';
  if (adminMode) {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
  }
  const platformParam = req.nextUrl.searchParams.get('platform');
  const platform =
    platformParam === 'facebook' ||
    platformParam === 'instagram' ||
    platformParam === 'tiktok'
      ? platformParam
      : undefined;
  const videos = adminMode
    ? store.getSocialVideosAll()
    : store.getSocialVideos(true, platform);
  return NextResponse.json({ videos });
}

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();

    if (!body.title || !body.url) {
      return NextResponse.json(
        { error: 'Title and video URL are required' },
        { status: 400 }
      );
    }

    const validation = validateSocialVideo(body.url);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error || 'Unsupported video URL' },
        { status: 400 }
      );
    }

    // Embed URL is always derived server-side from the URL (never trusted from
    // the client). Facebook share links are resolved to a canonical video URL.
    let embedUrl = validation.embedUrl ?? null;
    if (validation.platform === 'facebook' && validation.needsResolve) {
      embedUrl = await resolveFacebookShareEmbed(
        validation.normalizedUrl || body.url
      );
    }

    const item = store.saveSocialVideo({
      ...body,
      platform: validation.platform,
      url: validation.normalizedUrl,
      embedUrl,
    });
    await persistStore();
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save video';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Video ID required' }, { status: 400 });

  const deleted = store.deleteSocialVideo(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
