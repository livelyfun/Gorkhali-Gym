'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  X,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { ReviewItem } from '@/lib/data-store';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Submit Modal state
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, reviews.length]);

  const toggleExpand = (id: string) => {
    setIsPaused(true);
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrev = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName,
          rating,
          text: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      setSubmitSuccess(data.message);
      setAuthorName('');
      setReviewText('');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-[#0E1118] border-t border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
              <Star className="w-3.5 h-3.5 fill-red-500" />
              <span>Verified Member Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              REAL STORIES FROM OUR ATHLETES
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500 text-neutral-200 hover:text-white text-xs font-bold transition-all shadow"
            >
              <MessageSquarePlus className="w-4 h-4 text-red-500" />
              <span>Share Your Review</span>
            </button>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {reviews.slice(0, 3).map((rev) => {
            const isExpanded = !!expandedIds[rev.id];
            const hasMoreText = rev.fullText && rev.fullText.length > rev.previewText.length;

            return (
              <div
                key={rev.id}
                className="flex flex-col justify-between p-8 rounded-2xl bg-[#121620] border border-neutral-800/80 shadow-xl min-h-[290px] transition-all hover:border-neutral-700"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-neutral-800" />
                  </div>

                  {/* Review Text */}
                  <div className="text-sm text-neutral-300 leading-relaxed mb-4">
                    <p>{isExpanded ? rev.fullText : rev.previewText}</p>
                    {hasMoreText && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(rev.id)}
                        className="text-xs font-bold text-red-400 hover:text-red-300 mt-2 block transition-colors"
                      >
                        {isExpanded ? 'Show Less ↑' : 'Read More →'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">{rev.author}</h4>
                    <span className="text-[11px] text-neutral-500">
                      {new Date(rev.reviewDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
                    Verified Member
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Reviews Link */}
        <div className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-400 transition-colors"
          >
            <span>Read All Member Reviews & Testimonials</span>
            <ChevronRight className="w-3.5 h-3.5 text-red-500" />
          </Link>
        </div>
      </div>

      {/* Public Review Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#121620] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
            <button
              type="button"
              onClick={() => {
                setShowSubmitModal(false);
                setSubmitSuccess(null);
                setSubmitError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-6 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Review Submitted</h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-xs">{submitSuccess}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitSuccess(null);
                  }}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest block mb-1">
                  Community Feedback
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Leave a Member Review</h3>
                <p className="text-xs text-neutral-400 mb-6">
                  Reviews are reviewed by gym staff before appearing publicly on the website.
                </p>

                {submitError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Bipin Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Your Experience</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts about our equipment, trainers, and training atmosphere..."
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit for Moderation</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
