import { prisma, isDbConfigured } from './prisma';
import { store } from './data-store';
import { createHydrationController, type HydrationResult } from './hydration';

// The entire CMS state is persisted as a single JSONB row. This keeps the
// in-memory DataStore as the working set while making edits durable across
// serverless invocations (each cold start hydrates from Postgres).
const TABLE = '"CmsSnapshot"';
const ROW_ID = 'singleton';

type PersistGlobals = typeof globalThis & {
  __gorkhaliWriteVersion?: number;
  __gorkhaliWriteQueue?: Promise<void>;
  __gorkhaliTableEnsured?: boolean;
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

async function loadSnapshot(): Promise<unknown | null> {
  await ensureTable();
  const rows = await prisma.$queryRawUnsafe<Array<{ data: unknown }>>(
    `SELECT data FROM ${TABLE} WHERE id = $1`,
    ROW_ID,
  );
  if (rows.length === 0 || !rows[0].data) return null;
  const raw = rows[0].data;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

function currentWriteVersion(): number {
  return g.__gorkhaliWriteVersion ?? 0;
}

// Single controller per process. Loads the persisted snapshot into the in-memory
// store with bounded retries; retries again on a later request after failure.
const controller = createHydrationController<unknown>({
  load: loadSnapshot,
  apply: (data) => store.hydrate(data),
  persistBaseline: () => persistStore(),
  enabled: () => isDbConfigured,
  // A write that lands while a (slow) load is still running means the in-memory
  // state is newer than the snapshot; never overwrite it with stale data.
  hasStaleWrite: () => currentWriteVersion() > 0,
  maxAttempts: 4,
  baseDelayMs: 150,
  maxDelayMs: 2000,
  onError: (error, attempt) => {
    console.error(`[store-persistence] hydrate attempt ${attempt} failed:`, error);
  },
});

/**
 * Ensures the in-memory store reflects the persisted snapshot before serving
 * database-backed reads or accepting writes. Concurrency-safe and retried.
 */
export function ensureHydrated(): Promise<HydrationResult> {
  return controller.ensureHydrated();
}

/** Backwards-compatible wrapper: resolves true when authoritative data is ready. */
export async function hydrateStore(): Promise<boolean> {
  const result = await controller.ensureHydrated();
  return result.ready;
}

/**
 * Writes the current in-memory state back to Postgres. Writes are queued so
 * concurrent mutations within a process cannot interleave.
 */
export function persistStore(): Promise<void> {
  if (!isDbConfigured) return Promise.resolve();

  // Any persisted write makes the in-memory state newer than the stored
  // snapshot, so a hydration cycle must not overwrite it with stale data.
  g.__gorkhaliWriteVersion = currentWriteVersion() + 1;

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
