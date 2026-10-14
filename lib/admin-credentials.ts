import fs from 'fs';
import path from 'path';

export interface SeedCredentials {
  username: string;
  password: string;
}

const CREDENTIALS_FILE = 'credentials.md';

function parseCredentialsFile(contents: string): SeedCredentials | null {
  let username = '';
  let password = '';

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*(username|password)\s*:\s*(.+?)\s*$/i);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, '').trim();
    if (match[1].toLowerCase() === 'username') username = value;
    else password = value;
  }

  if (!username || !password) return null;
  return { username, password };
}

/**
 * Resolve the bootstrap admin credentials.
 *
 * Order of precedence:
 *  1. `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD` environment variables
 *     (required in production).
 *  2. In local development only, the gitignored `credentials.md` file in the
 *     repository root.
 */
export function getSeedCredentials(): SeedCredentials | null {
  const envUsername = process.env.ADMIN_SEED_USERNAME?.trim();
  const envPassword = process.env.ADMIN_SEED_PASSWORD?.trim();
  if (envUsername && envPassword) {
    return { username: envUsername, password: envPassword };
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[auth] No ADMIN_SEED_USERNAME / ADMIN_SEED_PASSWORD configured; no bootstrap admin account is available.'
    );
    return null;
  }

  try {
    const filePath = path.join(process.cwd(), CREDENTIALS_FILE);
    if (!fs.existsSync(filePath)) return null;
    return parseCredentialsFile(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}
