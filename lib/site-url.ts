const FALLBACK_SITE_URL = 'https://gorkhaligym.com';

export function getSiteUrl(): string {
  const raw = process.env.APP_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      // Ignore malformed values (e.g. "MY_APP_URL" placeholders) and fall back.
    }
  }
  return FALLBACK_SITE_URL;
}
