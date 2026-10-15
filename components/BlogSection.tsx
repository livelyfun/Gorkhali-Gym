'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import type { BlogPostItem } from '@/lib/data-store';

interface BlogSectionProps {
  posts: BlogPostItem[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-24 bg-[#0E1118] border-t border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Training Knowledge</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              LATEST FITNESS & RECOVERY ARTICLES
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-sm">
            Evidence-based advice on barbell technique, recovery protocols, and sports nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {posts.slice(0, 2).map((post) => (
            <div
              key={post.id}
              className="group flex flex-col sm:flex-row rounded-2xl bg-[#121620] border border-neutral-800 overflow-hidden shadow-xl hover:border-red-600/40 transition-all"
            >
              <div className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto shrink-0 bg-neutral-900 overflow-hidden">
                <Image
                  src={post.coverImage || '/images/hero_gorkhali_gym_1791802611195.jpg'}
                  alt={post.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-2">
                    <span className="text-red-400 font-semibold">{post.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                    </span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-red-400 transition-colors"
          >
            <span>Browse All Blog Articles</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}
