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
      <body className="bg-ak-ink text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 ak-panel ak-cut-both p-8">
          <h2 className="font-display text-2xl text-white">System Interruption</h2>
          <p className="text-ak-muted text-sm">
            Gorkhali Gym system encountered an unexpected issue.
          </p>
          <button onClick={() => reset()} className="ak-btn ak-btn-primary">
            <span>Reload Session</span>
          </button>
        </div>
      </body>
    </html>
  );
}
