'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowRight, ChevronLeft, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const post = store.getBlogPosts().find((p) => p.slug === slug && p.isPublished);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs text-neutral-400">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                <span>{post.publishedAt || 'Published'}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>{post.author}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {post.title}
            </h1>

            {post.category && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded bg-neutral-800 text-[11px] text-red-400 uppercase font-semibold">
                  #{post.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900">
            <Image
              src={post.coverImage || '/images/hero_gorkhali_gym.jpg'}
              alt={post.title}
              fill
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          </div>

          <div className="prose prose-invert max-w-none text-neutral-300 text-base leading-relaxed space-y-4 whitespace-pre-line">
            {post.content || post.excerpt}
          </div>

          <div className="pt-10 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-400">Written by</p>
              <p className="text-base font-bold text-white uppercase">{post.author}</p>
            </div>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Train With Coach At Gorkhali Gym
            </button>
          </div>
        </div>
      </article>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
