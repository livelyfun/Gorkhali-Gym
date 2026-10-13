'use client';

import React, { useState } from 'react';
import { X, Star, CheckCircle, Send, Loader2, Award } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [role, setRole] = useState('Gym Member');
  const [content, setContent] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setError('Please provide your name and your feedback review.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName,
          rating,
          role,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit review. Please try again.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error submitting review.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAuthorName('');
    setContent('');
    setRating(5);
    setSubmitted(false);
    setError(null);
    onClose();
  };

  const label = 'block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md ak-panel ak-cut-tr shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-ak-accent" />
        <button
          onClick={handleReset}
          className="ak-focus absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-ak-ink border border-ak-line hover:border-ak-accent transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500 skew-x-[-8deg]">
              <CheckCircle className="w-10 h-10 -skew-x-[-8deg]" />
            </div>
            <h3 className="ak-heading text-2xl text-white">Review Submitted!</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Thank you for sharing your experience at Gorkhali Gym! To maintain community authenticity, reviews are moderated by management before appearing publicly.
            </p>
            <button onClick={handleReset} className="ak-btn ak-btn-primary mt-4">
              <span>Done</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="ak-eyebrow mb-2 bg-amber-500/15 border-amber-500/30 text-amber-400">
                <Award className="w-3.5 h-3.5" />
                <span>Member Voice</span>
              </div>
              <h3 className="ak-heading text-2xl text-white">Leave a Review</h3>
              <p className="text-sm text-ak-muted mt-1">
                Share your journey, coach experience, or fitness transformation at Gorkhali Gym.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border-l-2 border-ak-accent text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="ak-focus p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating !== null ? star <= hoverRating : star <= rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-neutral-400 font-semibold ml-2 uppercase tracking-wider">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className={label}>Your Name *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Bipin Shrestha"
                  className="ak-input"
                />
              </div>

              <div>
                <label className={label}>Program or Member Type</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Strength Training Member (6 Months)"
                  className="ak-input"
                />
              </div>

              <div>
                <label className={label}>Your Review / Experience *</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What do you love most about training at Gorkhali Gym? The atmosphere, coaches, equipment..."
                  className="ak-input resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="ak-btn ak-btn-primary w-full disabled:opacity-50"
                >
                  <span>
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Review...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit for Verification</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
