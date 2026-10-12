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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-black uppercase text-white tracking-tight">
          Page Load Error
        </h2>
        <p className="text-neutral-400 text-sm">
          We encountered an issue loading this section of Gorkhali Gym.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs tracking-wider transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold uppercase text-xs tracking-wider transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
