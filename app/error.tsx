'use client';

import React from 'react';
import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen ak-page flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
      <div className="relative max-w-md w-full text-center space-y-6 ak-panel ak-cut-both p-8 shadow-2xl">
        <h2 className="font-display text-2xl text-white">Page Load Error</h2>
        <p className="text-ak-muted text-sm">
          We encountered an issue loading this section of Gorkhali Gym.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => reset()} className="ak-btn ak-btn-primary">
            <span>Try Again</span>
          </button>
          <Link href="/" className="ak-btn ak-btn-outline">
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
