export type SocialVideoPlatform = 'facebook' | 'instagram' | 'tiktok';

export interface SocialVideoValidation {
  ok: boolean;
  platform?: SocialVideoPlatform;
  normalizedUrl?: string;
  embedUrl?: string;
  /**
   * True for links that are valid but not directly embeddable and must be
   * resolved to a canonical video URL on the server (e.g. Facebook share links).
   */
  needsResolve?: boolean;
  error?: string;
}

const FACEBOOK_HOSTS = new Set([
  'facebook.com',
  'www.facebook.com',
  'm.facebook.com',
  'web.facebook.com',
  'mbasic.facebook.com',
  'fb.watch',
  'fb.com',
  'www.fb.com',
]);

const INSTAGRAM_HOSTS = new Set([
  'instagram.com',
  'www.instagram.com',
  'm.instagram.com',
]);

const TIKTOK_HOSTS = new Set([
  'tiktok.com',
  'www.tiktok.com',
  'm.tiktok.com',
]);

const TIKTOK_SHORT_HOSTS = new Set([
  'vm.tiktok.com',
  'vt.tiktok.com',
]);

export const PLATFORM_LABELS: Record<SocialVideoPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

function extractInstagramEmbed(
  pathname: string
): { embedUrl: string } | { error: string } {
  const match = pathname.match(/^\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) {
    return {
      error:
        'Unsupported Instagram link. Paste a Reel, Post, or IGTV URL, e.g. https://www.instagram.com/reel/ABC123/',
    };
  }
  const kind = match[1] === 'reels' ? 'reel' : match[1];
  const id = match[2];
  return { embedUrl: `https://www.instagram.com/${kind}/${id}/embed/` };
}

function extractTikTokEmbed(
  url: URL
): { embedUrl: string } | { error: string } {
  if (TIKTOK_SHORT_HOSTS.has(url.hostname)) {
    return {
      error:
        'Short TikTok links cannot be embedded. Open the video and paste the full URL, e.g. https://www.tiktok.com/@user/video/1234567890',
    };
  }
  const pathMatch = url.pathname.match(/^\/@[^/]+\/video\/(\d+)/);
  const shortMatch = url.pathname.match(/^\/v\/(\d+)\.html/);
  const id = pathMatch?.[1] || shortMatch?.[1];
  if (!id) {
    return {
      error:
        'Unsupported TikTok link. Paste a full video URL, e.g. https://www.tiktok.com/@user/video/1234567890',
    };
  }
  return { embedUrl: `https://www.tiktok.com/embed/v2/${id}` };
}

function extractFacebookEmbed(
  url: URL
): { embedUrl?: string; needsResolve?: boolean } | { error: string } {
  // Facebook share links (e.g. /share/r/<id>/) are not embeddable directly;
  // they redirect to a canonical watch/reel URL that the server resolves.
  if (url.pathname.startsWith('/share/')) {
    return { needsResolve: true };
  }

  const isVideoPath =
    url.hostname === 'fb.watch' ||
    url.hostname.endsWith('fb.watch') ||
    url.pathname.startsWith('/watch') ||
    url.pathname.startsWith('/reel') ||
    url.pathname.includes('/videos/') ||
    url.pathname.includes('video.php');

  if (!isVideoPath) {
    return {
      error:
        'Unsupported Facebook link. Paste a video, Reel, or Watch URL, e.g. https://www.facebook.com/watch/?v=1234567890',
    };
  }

  return { embedUrl: facebookEmbedUrl(url.toString()) };
}

/**
 * Build the official Facebook video plugin embed for a canonical Facebook
 * video / Reel / Watch URL. Never fabricates an ID.
 */
export function facebookEmbedUrl(canonicalUrl: string): string {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    canonicalUrl
  )}&show_text=false&width=560&autoplay=false`;
}

/**
 * Whether a URL is a Facebook share link that must be resolved to a canonical
 * video URL before it can be embedded.
 */
export function isFacebookShareUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl.trim().replace(/^["'<]+|[">']+$/g, ''));
    return (
      url.hostname.toLowerCase().endsWith('facebook.com') &&
      url.pathname.startsWith('/share/')
    );
  } catch {
    return false;
  }
}

/**
 * Validate a Facebook / Instagram / TikTok video URL, detect the platform, and
 * derive the official embed URL. Pure and dependency-free so it can run both on
 * the server (authoritative validation in the API) and in the admin UI.
 */
export function validateSocialVideo(rawUrl: string): SocialVideoValidation {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { ok: false, error: 'Please enter a video URL.' };
  }

  const cleaned = rawUrl.trim().replace(/^["'<]+|[">']+$/g, '');

  let url: URL;
  try {
    url = new URL(cleaned);
  } catch {
    return { ok: false, error: 'That does not look like a valid URL.' };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'Only http(s) video links are supported.' };
  }

  // Normalize to https for privacy/security and stable embeds.
  url.protocol = 'https:';
  const hostname = url.hostname.toLowerCase();
  url.hostname = hostname;

  if (FACEBOOK_HOSTS.has(hostname)) {
    const result = extractFacebookEmbed(url);
    if ('error' in result) return { ok: false, error: result.error };
    return {
      ok: true,
      platform: 'facebook',
      normalizedUrl: url.toString(),
      embedUrl: result.embedUrl,
      needsResolve: result.needsResolve,
    };
  }

  if (INSTAGRAM_HOSTS.has(hostname)) {
    const result = extractInstagramEmbed(url.pathname);
    if ('error' in result) return { ok: false, error: result.error };
    return {
      ok: true,
      platform: 'instagram',
      normalizedUrl: url.toString(),
      embedUrl: result.embedUrl,
    };
  }

  if (TIKTOK_HOSTS.has(hostname) || TIKTOK_SHORT_HOSTS.has(hostname)) {
    const result = extractTikTokEmbed(url);
    if ('error' in result) return { ok: false, error: result.error };
    return {
      ok: true,
      platform: 'tiktok',
      normalizedUrl: url.toString(),
      embedUrl: result.embedUrl,
    };
  }

  return {
    ok: false,
    error:
      'Unsupported platform. Only Facebook, Instagram, and TikTok video links are supported.',
  };
}
