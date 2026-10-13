'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowRight, ChevronRight, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function BlogPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const posts = store.getBlogPosts().filter((p) => p.isPublished);

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="ak-eyebrow mb-4">
              Knowledge &bull; Education &bull; Gorkhali Gym
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white mt-2">
              Fitness & Training Insights
            </h1>
            <p className="text-ak-muted text-base sm:text-lg mt-4 leading-relaxed">
              Practical guides on progressive overload, recovery nutrition, injury avoidance, and building lasting fitness habits in Nepal.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16 ak-panel ak-cut-tr p-8">
              <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="font-display text-lg text-white">Articles in Preparation</h3>
              <p className="text-sm text-ak-muted mt-1 max-w-sm mx-auto">
                Check back shortly for upcoming fitness articles written by our coaching staff.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="ak-panel ak-cut-tr overflow-hidden group hover:border-ak-accent/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="ak-frame ak-hover-group relative h-56 w-full">
                      <Image
                        src={post.coverImage || '/images/hero_gorkhali_gym.jpg'}
                        alt={post.title}
                        fill
                        referrerPolicy="no-referrer"
                        className="ak-img object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-transparent to-transparent" />
                      {post.category && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-neutral-200 font-bold text-[10px] uppercase tracking-wider">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-3 text-xs text-ak-muted">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-ak-accent" />
                          <span>{post.publishedAt || 'Recent'}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-ak-muted" />
                          <span>{post.author}</span>
                        </span>
                      </div>

                      <h2 className="font-display text-xl text-white group-hover:text-ak-accent transition-colors">
                        <Link href={`/blog/${post.slug}`} className="ak-focus">{post.title}</Link>
                      </h2>

                      <p className="text-xs text-ak-muted leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-ak-line mt-4 flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="ak-focus ak-link text-xs font-bold text-ak-accent hover:text-white uppercase tracking-wider flex items-center space-x-1"
                    >
                      <span>Read Article</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
