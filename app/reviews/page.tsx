'use client';

import React, { useState } from 'react';
import { Star, MessageSquarePlus, Award, ShieldCheck, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewModal from '@/components/ReviewModal';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
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
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <PageHero
            pageSlug="reviews"
            wrapperClassName="max-w-2xl"
            fallback={{
              eyebrow: 'Member Testimonials • Gorkhali Gym Itahari',
              heading: 'Genuine Stories & Reviews',
              body: 'Read how members of all fitness levels found consistency, power, and mutual respect training under the Gorkhali banner.',
            }}
          />

          <div className="flex items-center space-x-4 shrink-0">
            <div className="ak-panel ak-cut-bl p-4 text-center">
              <div className="flex items-center justify-center space-x-1 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="font-display text-2xl text-white">{avgRating}</span>
              </div>
              <span className="text-[10px] text-ak-muted uppercase tracking-wider">
                Overall Rating ({reviews.length})
              </span>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="ak-btn ak-btn-primary"
            >
              <span>
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="ak-panel ak-cut-tr p-6 flex flex-col justify-between gap-4 hover:border-ak-accent/50 transition-colors"
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

                <div className="pt-4 border-t border-ak-line flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{rev.authorName || rev.author}</h3>
                    <p className="text-xs text-ak-muted">{rev.role || 'Gorkhali Member'}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-ak-accent text-[10px] uppercase font-bold tracking-wider">
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
              className="ak-btn ak-btn-primary"
            >
              <span>
                <MessageSquarePlus className="w-4 h-4" />
                <span>Have you trained with us? Leave your review</span>
              </span>
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
