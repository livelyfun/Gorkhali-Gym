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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Facility &bull; Brotherhood &bull; Gorkhali Gym
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Inside Gorkhali Gym
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Explore our training floor, power racks, dumbell sections, cardio machines, and community lifting atmosphere in Itahari.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === cat
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
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
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 aspect-[4/3] shadow-lg"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title || 'Gorkhali Gym Facility'}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                    {item.category || 'Facility'}
                  </span>
                  <h3 className="text-base font-bold text-white uppercase">{item.title}</h3>
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
