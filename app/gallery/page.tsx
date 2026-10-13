'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function GalleryPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const galleryItems = store.getGalleryItems().filter((item) => item.isPublished);

  const categories = ['all', ...Array.from(new Set(galleryItems.map((g) => g.category).filter(Boolean)))];

  const filteredItems =
    filter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="ak-eyebrow mb-4">
              Facility &bull; Brotherhood &bull; Gorkhali Gym
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white mt-2">
              Inside Gorkhali Gym
            </h1>
            <p className="text-ak-muted text-base sm:text-lg mt-4 leading-relaxed">
              Explore our training floor, power racks, dumbell sections, cardio machines, and community lifting atmosphere in Itahari.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`ak-focus px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    filter === cat
                      ? 'bg-ak-accent text-white'
                      : 'bg-ak-surface text-ak-muted hover:text-white border border-ak-line'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative ak-panel ak-cut-tr ak-frame ak-hover-group aspect-[4/3]"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title || 'Gorkhali Gym Facility'}
                  fill
                  referrerPolicy="no-referrer"
                  className="ak-img object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ak-ink/90 via-ak-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <span className="text-[10px] text-ak-accent font-bold uppercase tracking-widest">
                    {item.category || 'Facility'}
                  </span>
                  <h3 className="font-display text-base text-white uppercase">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs text-neutral-300 mt-1">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
