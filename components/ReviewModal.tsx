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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Review Submitted!
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Thank you for sharing your experience at Gorkhali Gym! To maintain community authenticity, reviews are moderated by management before appearing publicly.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Member Voice</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Leave a Review
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                Share your journey, coach experience, or fitness transformation at Gorkhali Gym.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Your Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
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
                  <span className="text-xs text-neutral-400 font-semibold ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Bipin Shrestha"
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Program or Member Type
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Strength Training Member (6 Months)"
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Your Review / Experience *
                </label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What do you love most about training at Gorkhali Gym? The atmosphere, coaches, equipment..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
                >
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
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
