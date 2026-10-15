// Generic, concurrency-safe hydration controller.
//
// The CMS keeps a data-store singleton in memory as its working set and persists
// it as a single JSONB snapshot. Every process must load that snapshot before it
// may serve database-backed reads or accept writes, otherwise it would operate on
// (and later persist) seeded defaults, silently clobbering authoritative data.
//
// This module is intentionally dependency-free so the orchestration can be unit
// tested with fake loaders. The Prisma/DataStore wiring lives in
// lib/store-persistence.ts.

export type HydrationStatus = 'idle' | 'pending' | 'ready' | 'failed';

export interface HydrationResult {
  /** True when authoritative data is available (loaded, already loaded, or DB disabled). */
  ready: boolean;
  /** True when a snapshot was actually applied to the in-memory store in this cycle. */
  applied: boolean;
  /** True when applying was skipped because newer in-memory writes already exist. */
  skippedStale?: boolean;
  /** True when the database is intentionally not configured (in-memory mode). */
  disabled?: boolean;
  /** Last error observed when hydration failed. */
  error?: unknown;
}

export interface HydrationControllerOptions<TSnapshot> {
  /** Loads the persisted snapshot, or resolves null when none exists yet. */
  load: () => Promise<TSnapshot | null>;
  /** Applies a loaded snapshot to the in-memory store. */
  apply: (data: TSnapshot) => void;
  /** Called when no snapshot exists yet so the current seed can be persisted. */
  persistBaseline?: () => Promise<void>;
  /** Returns false to signal in-memory-only mode (no database configured). */
  enabled?: () => boolean;
  /** True when the in-memory store already holds writes newer than the snapshot. */
  hasStaleWrite?: () => boolean;
  /** Bounded attempts per hydration cycle. */
  maxAttempts?: number;
  /** Backoff base in milliseconds. */
  baseDelayMs?: number;
  /** Backoff cap in milliseconds. */
  maxDelayMs?: number;
  sleep?: (ms: number) => Promise<void>;
  onError?: (error: unknown, attempt: number) => void;
}

export interface HydrationController {
  ensureHydrated(): Promise<HydrationResult>;
  getStatus(): HydrationStatus;
  /** Clears state. Intended for tests. */
  reset(): void;
}

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function createHydrationController<TSnapshot>(
  options: HydrationControllerOptions<TSnapshot>
): HydrationController {
  const {
    load,
    apply,
    persistBaseline,
    enabled = () => true,
    hasStaleWrite = () => false,
    maxAttempts = 4,
    baseDelayMs = 150,
    maxDelayMs = 2000,
    sleep = defaultSleep,
    onError,
  } = options;

  let status: HydrationStatus = 'idle';
  let inFlight: Promise<HydrationResult> | null = null;
  let lastResult: HydrationResult | null = null;

  const backoff = (attempt: number) =>
    Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));

  async function runCycle(): Promise<HydrationResult> {
    status = 'pending';
    let lastError: unknown;

    for (let attempt = 1; attempt <= Math.max(1, maxAttempts); attempt++) {
      try {
        const data = await load();

        if (data === null || data === undefined) {
          if (persistBaseline) await persistBaseline();
          status = 'ready';
          return { ready: true, applied: false };
        }

        if (hasStaleWrite()) {
          // A newer in-memory write exists; the snapshot is stale. Keep memory.
          status = 'ready';
          return { ready: true, applied: false, skippedStale: true };
        }

        apply(data);
        status = 'ready';
        return { ready: true, applied: true };
      } catch (error) {
        lastError = error;
        onError?.(error, attempt);
        if (attempt < Math.max(1, maxAttempts)) {
          await sleep(backoff(attempt));
        }
      }
    }

    status = 'failed';
    return { ready: false, applied: false, error: lastError };
  }

  function ensureHydrated(): Promise<HydrationResult> {
    if (!enabled()) {
      return Promise.resolve({ ready: true, applied: false, disabled: true });
    }
    if (status === 'ready' && lastResult) {
      return Promise.resolve(lastResult);
    }
    if (inFlight) {
      // Concurrent callers share the single in-flight cycle.
      return inFlight;
    }

    inFlight = runCycle()
      .then((result) => {
        lastResult = result;
        return result;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  }

  return {
    ensureHydrated,
    getStatus: () => status,
    reset: () => {
      status = 'idle';
      inFlight = null;
      lastResult = null;
    },
  };
}
