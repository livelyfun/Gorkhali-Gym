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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Knowledge &bull; Education &bull; Gorkhali Gym
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Fitness & Training Insights
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Practical guides on progressive overload, recovery nutrition, injury avoidance, and building lasting fitness habits in Nepal.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8">
              <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white uppercase">Articles in Preparation</h3>
              <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
                Check back shortly for upcoming fitness articles written by our coaching staff.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 w-full bg-neutral-950">
                      <Image
                        src={post.coverImage || '/images/hero_gorkhali_gym.jpg'}
                        alt={post.title}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                      {post.category && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-neutral-200 font-bold text-[10px] uppercase tracking-wider">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-3 text-xs text-neutral-400">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          <span>{post.publishedAt || 'Recent'}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{post.author}</span>
                        </span>
                      </div>

                      <h2 className="text-xl font-bold uppercase text-white group-hover:text-red-500 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center space-x-1"
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
