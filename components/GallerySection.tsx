'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import type { GalleryItemType } from '@/lib/data-store';

interface GallerySectionProps {
  items: GalleryItemType[];
}

export default function GallerySection({ items }: GallerySectionProps) {
  const [activeOrientation, setActiveOrientation] = useState<'all' | 'landscape' | 'portrait'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<GalleryItemType | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter items based on orientation & category
  const filteredItems = items.filter((item) => {
    if (activeOrientation !== 'all' && item.orientation !== activeOrientation) return false;
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return true;
  });

  // Auto-play carousel
  useEffect(() => {
    if (isPaused || filteredItems.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, filteredItems.length]);

  const handleNext = () => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section className="py-24 bg-[#0A0C10] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Facility & Training Photography
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              LOOK INSIDE GORKHALI GYM
            </h2>
          </div>

          {/* Format & Category Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-neutral-900 p-1 border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveOrientation('all');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeOrientation === 'all' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Formats
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveOrientation('landscape');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeOrientation === 'landscape' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Horizontal (16:9)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveOrientation('portrait');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeOrientation === 'portrait' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Vertical (3:4)
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Showcase Container */}
        {filteredItems.length > 0 ? (
          <div
            className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl mb-8 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            {/* Active Display Frame */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[550px] overflow-hidden flex items-center justify-center bg-black">
              <Image
                src={filteredItems[currentIndex].imageUrl}
                alt={filteredItems[currentIndex].title}
                fill
                referrerPolicy="no-referrer"
                className={`object-contain transition-all duration-700 ${
                  filteredItems[currentIndex].orientation === 'portrait' ? 'max-w-md mx-auto' : 'object-cover'
                }`}
              />

              {/* Scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Caption Bar */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div className="max-w-xl">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                    {filteredItems[currentIndex].category} · {filteredItems[currentIndex].orientation}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    {filteredItems[currentIndex].title}
                  </h3>
                  {filteredItems[currentIndex].caption && (
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1 line-clamp-2">
                      {filteredItems[currentIndex].caption}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxItem(filteredItems[currentIndex])}
                  className="p-3 rounded-xl bg-neutral-900/80 hover:bg-red-600 text-white border border-neutral-700 hover:border-red-600 backdrop-blur-md transition-colors"
                  aria-label="Enlarge photograph"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              {/* Previous & Next Manual Controls */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-neutral-700 hover:border-red-600 backdrop-blur-md transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-neutral-700 hover:border-red-600 backdrop-blur-md transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-neutral-800 text-[11px] font-mono text-neutral-300">
              <span>{currentIndex + 1}</span>
              <span>/</span>
              <span>{filteredItems.length}</span>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-500 text-sm">
            No photographs available for this filter.
          </div>
        )}

        {/* Thumbnail Preview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {filteredItems.slice(0, 4).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border transition-all ${
                currentIndex === idx
                  ? 'border-red-500 ring-2 ring-red-500/30 scale-98'
                  : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Link to Full Gallery Page */}
        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-red-400 transition-colors"
          >
            <span>Explore Full Gallery Archive</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute -top-12 right-0 p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-black border border-neutral-800">
              <Image
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                fill
                referrerPolicy="no-referrer"
                className="object-contain"
              />
            </div>

            <div className="w-full text-center mt-4">
              <h4 className="text-lg font-bold text-white">{lightboxItem.title}</h4>
              {lightboxItem.caption && (
                <p className="text-xs text-neutral-400 mt-1 max-w-lg mx-auto">
                  {lightboxItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
