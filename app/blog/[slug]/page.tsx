'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowRight, ChevronLeft, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { useCms } from '@/components/cms/CmsProvider';

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const { data } = useCms();
  const posts = data.blog;
  if (!posts) return null;
  const post = posts.find((p) => p.slug === slug && p.isPublished);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="ak-focus ak-link inline-flex items-center space-x-1.5 text-xs text-ak-muted hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs text-ak-muted">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-ak-accent" />
                <span>{post.publishedAt || 'Published'}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-ak-muted" />
                <span>{post.author}</span>
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-white">
              {post.title}
            </h1>

            {post.category && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-ak-ink border border-ak-accent/40 text-ak-accent text-[11px] uppercase font-semibold tracking-wider">
                  #{post.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <article className="py-24 bg-ak-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="ak-frame ak-hover-group relative h-96 w-full border border-ak-line bg-ak-surface">
            <Image
              src={post.coverImage || '/images/hero_gorkhali_gym.jpg'}
              alt={post.title}
              fill
              referrerPolicy="no-referrer"
              className="ak-img"
            />
          </div>

          <section className="bg-ak-surface-2 border-y border-ak-line -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
            <div className="prose prose-invert max-w-none text-neutral-300 text-base leading-relaxed space-y-4 whitespace-pre-line">
              {post.content || post.excerpt}
            </div>
          </section>

          <div className="pt-10 border-t border-ak-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-ak-muted">Written by</p>
              <p className="text-base font-bold text-white uppercase">{post.author}</p>
            </div>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="ak-btn ak-btn-primary"
            >
              <span>Train With Coach At Gorkhali Gym</span>
            </button>
          </div>
        </div>
      </article>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
