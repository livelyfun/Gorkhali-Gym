'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
          <h2 className="text-2xl font-black uppercase text-white tracking-tight">
            System Interruption
          </h2>
          <p className="text-neutral-400 text-sm">
            Gorkhali Gym system encountered an unexpected issue.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs tracking-wider transition-colors"
          >
            Reload Session
          </button>
        </div>
      </body>
    </html>
  );
}
