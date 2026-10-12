'use client';

import React, { useState } from 'react';
import { Star, MessageSquarePlus, Award, ShieldCheck, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewModal from '@/components/ReviewModal';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function ReviewsPage() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const reviews = store.getReviews().filter((r) => r.isPublished);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Member Testimonials &bull; Gorkhali Gym Itahari
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Genuine Stories & Reviews
            </h1>
            <p className="text-neutral-400 text-base mt-3 leading-relaxed">
              Read how members of all fitness levels found consistency, power, and mutual respect training under the Gorkhali banner.
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
              <div className="flex items-center justify-center space-x-1 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="text-2xl font-black text-white">{avgRating}</span>
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Overall Rating ({reviews.length})
              </span>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-6 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30 flex items-center space-x-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed italic">
                    &ldquo;{rev.content || rev.fullText || rev.previewText}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase">{rev.authorName || rev.author}</h3>
                    <p className="text-xs text-neutral-400">{rev.role || 'Gorkhali Member'}</p>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold uppercase bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:border-red-600 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4 text-red-500" />
              <span>Have you trained with us? Leave your review</span>
            </button>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
