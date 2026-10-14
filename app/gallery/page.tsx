'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Sparkles, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import SocialVideoEmbed from '@/components/SocialVideoEmbed';
import PageHero from '@/components/PageHero';
import { store, type SocialVideoItem } from '@/lib/data-store';

export default function GalleryPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [videos, setVideos] = useState<SocialVideoItem[]>([]);

  const galleryItems = store.getGalleryItems().filter((item) => item.isPublished);

  // Social videos are CMS-managed and live in the API's store instance, so the
  // public page reads published videos from the same CMS endpoint the admin writes to.
  useEffect(() => {
    let ignore = false;
    fetch('/api/cms/social-videos')
      .then((res) => (res.ok ? res.json() : { videos: [] }))
      .then((data) => {
        if (!ignore && Array.isArray(data.videos)) setVideos(data.videos);
      })
      .catch(() => {
        // Leave the video grid empty if the CMS is unreachable.
      });
    return () => {
      ignore = true;
    };
  }, []);

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
          <PageHero
            pageSlug="gallery"
            fallback={{
              eyebrow: 'Facility • Brotherhood • Gorkhali Gym',
              heading: 'Inside Gorkhali Gym',
              body: 'Explore our training floor, power racks, dumbell sections, cardio machines, and community lifting atmosphere in Itahari.',
            }}
          />
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

      {videos.length > 0 && (
        <section className="py-24 bg-ak-surface border-t border-ak-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-3xl">
              <div className="ak-eyebrow mb-3 flex items-center gap-2">
                <Play className="w-3.5 h-3.5 -skew-x-12 fill-ak-accent text-ak-accent" />
                Social &bull; Reels &bull; Clips
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white">
                Watch the Action
              </h2>
              <p className="text-ak-muted mt-3 text-sm sm:text-base">
                Training clips, transformations, and behind-the-scenes moments from our Facebook, Instagram, and TikTok.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <SocialVideoEmbed key={video.id} video={video} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
