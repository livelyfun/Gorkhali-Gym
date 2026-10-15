import test from 'node:test';
import { createHydrationController } from '../lib/hydration.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

test('hydrates once and reuses the result', async () => {
  let loads = 0;
  let appliedValue: number | null = null;

  const controller = createHydrationController<{ v: number }>({
    load: async () => {
      loads += 1;
      return { v: 7 };
    },
    apply: (snapshot) => {
      appliedValue = snapshot.v;
    },
    sleep: async () => {},
  });

  const first = await controller.ensureHydrated();
  const second = await controller.ensureHydrated();

  assert(first.ready && first.applied, 'first cycle should apply the snapshot');
  assert(second.ready && second.applied, 'second call should reuse the cached result');
  assert(appliedValue === 7, 'snapshot value should be applied');
  assert(controller.getStatus() === 'ready', 'status should be ready');
  assert(loads === 1, `load should run once, ran ${loads}`);
});

test('concurrent callers share a single in-flight load', async () => {
  let loads = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  const controller = createHydrationController<{ v: number }>({
    load: async () => {
      loads += 1;
      await gate;
      return { v: 1 };
    },
    apply: () => {},
    sleep: async () => {},
  });

  const calls = Promise.all([
    controller.ensureHydrated(),
    controller.ensureHydrated(),
    controller.ensureHydrated(),
  ]);
  release();
  const results = await calls;

  assert(results.every((r) => r.ready), 'all callers should be ready');
  assert(loads === 1, `load should be single-flight, ran ${loads}`);
});

test('retries with backoff then succeeds', async () => {
  let loads = 0;
  const delays: number[] = [];

  const controller = createHydrationController<{ v: number }>({
    load: async () => {
      loads += 1;
      if (loads < 3) throw new Error('transient');
      return { v: 42 };
    },
    apply: () => {},
    maxAttempts: 4,
    baseDelayMs: 10,
    sleep: async (ms) => {
      delays.push(ms);
    },
  });

  const result = await controller.ensureHydrated();

  assert(result.ready && result.applied, 'should eventually hydrate');
  assert(loads === 3, `expected 3 attempts, got ${loads}`);
  assert(
    delays.length === 2 && delays[0] === 10 && delays[1] === 20,
    `expected exponential backoff [10,20], got [${delays.join(',')}]`,
  );
});

test('reports failure after exhausting attempts, then retries later', async () => {
  let loads = 0;

  const controller = createHydrationController<{ v: number }>({
    load: async () => {
      loads += 1;
      if (loads <= 4) throw new Error('down');
      return { v: 5 };
    },
    apply: () => {},
    maxAttempts: 4,
    sleep: async () => {},
  });

  const failed = await controller.ensureHydrated();
  assert(!failed.ready, 'first cycle should fail');
  assert(failed.error instanceof Error, 'error should be surfaced');
  assert(controller.getStatus() === 'failed', 'status should be failed');
  assert(loads === 4, `expected 4 attempts, got ${loads}`);

  const recovered = await controller.ensureHydrated();
  assert(recovered.ready && recovered.applied, 'a later call should retry and succeed');
  assert(loads === 5, `expected a new attempt, got ${loads}`);
});

test('in-memory mode (disabled) skips loading', async () => {
  let loads = 0;
  const controller = createHydrationController<{ v: number }>({
    load: async () => {
      loads += 1;
      return null;
    },
    apply: () => {},
    enabled: () => false,
  });

  const result = await controller.ensureHydrated();
  assert(result.ready && result.disabled === true, 'disabled should be ready');
  assert(loads === 0, 'no load when disabled');
});

test('persists baseline when no snapshot exists', async () => {
  let baseline = 0;
  const controller = createHydrationController<unknown>({
    load: async () => null,
    apply: () => {},
    persistBaseline: async () => {
      baseline += 1;
    },
    sleep: async () => {},
  });

  const result = await controller.ensureHydrated();
  assert(result.ready && !result.applied, 'no snapshot means nothing applied');
  assert(baseline === 1, 'baseline should be persisted once');
});

test('does not overwrite newer in-memory writes with a stale snapshot', async () => {
  let applied = 0;
  let stale = false;

  const controller = createHydrationController<{ v: number }>({
    load: async () => {
      stale = true; // a write lands while the snapshot is loading
      return { v: 1 };
    },
    apply: () => {
      applied += 1;
    },
    hasStaleWrite: () => stale,
    sleep: async () => {},
  });

  const result = await controller.ensureHydrated();
  assert(result.ready, 'should be ready');
  assert(result.skippedStale === true, 'should flag the skipped stale apply');
  assert(applied === 0, 'must not apply a stale snapshot over newer writes');
});
