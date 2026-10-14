export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { hydrateStore } = await import('./lib/store-persistence');
    await hydrateStore();
  }
}
