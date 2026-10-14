import { prisma, isDbConfigured } from './prisma';
import { store } from './data-store';

// The entire CMS state is persisted as a single JSONB row. This keeps the
// in-memory DataStore as the working set while making edits durable across
// serverless invocations (each cold start hydrates from Postgres).
const TABLE = '"CmsSnapshot"';
const ROW_ID = 'singleton';

type PersistGlobals = typeof globalThis & {
  __gorkhaliHydrated?: boolean;
  __gorkhaliHydratePromise?: Promise<boolean>;
  __gorkhaliTableEnsured?: boolean;
  __gorkhaliWriteQueue?: Promise<void>;
};

const g = globalThis as PersistGlobals;

async function ensureTable(): Promise<void> {
  if (g.__gorkhaliTableEnsured) return;
  await prisma.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS ${TABLE} (
       id text PRIMARY KEY,
       data jsonb NOT NULL,
       updated_at timestamptz NOT NULL DEFAULT now()
     )`,
  );
  g.__gorkhaliTableEnsured = true;
}

/**
 * Loads the persisted snapshot into the in-memory store (once per process).
 * If no snapshot exists yet, the current seed state is written as the baseline.
 */
export async function hydrateStore(): Promise<boolean> {
  if (!isDbConfigured) return false;
  if (g.__gorkhaliHydrated) return true;
  if (g.__gorkhaliHydratePromise) return g.__gorkhaliHydratePromise;

  g.__gorkhaliHydratePromise = (async () => {
    try {
      await ensureTable();
      const rows = await prisma.$queryRawUnsafe<Array<{ data: unknown }>>(
        `SELECT data FROM ${TABLE} WHERE id = $1`,
        ROW_ID,
      );
      if (rows.length > 0 && rows[0].data) {
        const raw = rows[0].data;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        store.hydrate(parsed);
      } else {
        await persistStore();
      }
      g.__gorkhaliHydrated = true;
      return true;
    } catch (err) {
      console.error('[store-persistence] hydrate failed, continuing in-memory:', err);
      g.__gorkhaliHydratePromise = undefined;
      return false;
    }
  })();

  return g.__gorkhaliHydratePromise;
}

/**
 * Writes the current in-memory state back to Postgres. Writes are queued so
 * concurrent mutations within a process cannot interleave.
 */
export function persistStore(): Promise<void> {
  if (!isDbConfigured) return Promise.resolve();

  const run = async () => {
    try {
      await ensureTable();
      const payload = JSON.stringify(store.snapshot());
      await prisma.$executeRawUnsafe(
        `INSERT INTO ${TABLE} (id, data, updated_at)
         VALUES ($1, $2::jsonb, now())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
        ROW_ID,
        payload,
      );
    } catch (err) {
      console.error('[store-persistence] persist failed:', err);
    }
  };

  const prev = g.__gorkhaliWriteQueue ?? Promise.resolve();
  const next = prev.then(run, run);
  g.__gorkhaliWriteQueue = next;
  return next;
}
