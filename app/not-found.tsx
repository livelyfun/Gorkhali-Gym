import React from 'react';
import Link from 'next/link';
import { Dumbbell, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen ak-page flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
      <div className="relative max-w-md w-full text-center space-y-8 ak-panel ak-cut-both p-8 sm:p-12 shadow-2xl">
        <div className="w-20 h-20 bg-ak-accent/10 border border-ak-accent/30 text-ak-accent flex items-center justify-center mx-auto skew-x-[-8deg]">
          <Dumbbell className="w-10 h-10 -skew-x-[-8deg] animate-bounce" />
        </div>

        <div className="space-y-3">
          <div className="ak-eyebrow justify-center">Gorkhali Gym &bull; 404 Error</div>
          <h1 className="font-display text-3xl sm:text-4xl text-white">Rep Missed!</h1>
          <p className="text-ak-muted text-sm leading-relaxed">
            The page you are looking for has been moved, removed, or doesn&apos;t exist in the training log.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="ak-btn ak-btn-primary">
            <span>
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </span>
          </Link>
          <Link href="/training" className="ak-btn ak-btn-outline">
            <span>
              <ArrowLeft className="w-4 h-4" />
              <span>View Programs</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
