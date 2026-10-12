import React from 'react';
import Link from 'next/link';
import { Dumbbell, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8 bg-neutral-900/80 border border-neutral-800 p-8 sm:p-12 rounded-3xl shadow-2xl">
        <div className="w-20 h-20 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-500 flex items-center justify-center mx-auto shadow-inner">
          <Dumbbell className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-3">
          <span className="text-red-500 font-bold text-xs uppercase tracking-widest">
            Gorkhali Gym &bull; 404 Error
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Rep Missed!
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            The page you are looking for has been moved, removed, or doesn&apos;t exist in the training log.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/training"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-colors border border-neutral-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Programs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
