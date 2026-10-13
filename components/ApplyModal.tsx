'use client';

import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, Send, Loader2, Sparkles, Phone, User, MessageSquare } from 'lucide-react';
import { store } from '@/lib/data-store';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export default function ApplyModal({
  isOpen,
  onClose,
  defaultProgram = 'General Strength & Conditioning',
}: ApplyModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState(defaultProgram);
  const [preferredTime, setPreferredTime] = useState('Morning (5:30 AM - 9:00 AM)');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const settings = store.getSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          program,
          preferredTime,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit application. Please try again.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error submitting application.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setMessage('');
    setSubmitted(false);
    setError(null);
    onClose();
  };

  const waText = encodeURIComponent(
    `Namaste Gorkhali Gym! I just applied for ${program}. My name is ${fullName || 'a prospective member'} (${phone}). I'd like to get started!`
  );
  const waUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${waText}`;

  const label = 'block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg ak-panel ak-cut-tr shadow-2xl overflow-hidden p-6 sm:p-8"
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
            <h3 className="ak-heading text-2xl text-white">Application Received!</h3>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-sm mx-auto">
              Thank you, <span className="font-semibold text-white">{fullName}</span>. Our Gorkhali
              Gym team will contact you shortly to confirm your orientation and schedule.
            </p>

            <div className="pt-4 pb-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ak-focus w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
              <p className="text-xs text-neutral-500 mt-2">
                Need immediate response? Tap to chat with Coach directly on WhatsApp.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="ak-focus text-xs text-neutral-400 hover:text-ak-accent underline pt-2 transition-colors"
            >
              Done / Return to Website
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="ak-eyebrow mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Begin Your Fitness Journey</span>
              </div>
              <h3 className="ak-heading text-2xl text-white">Apply for Membership</h3>
              <p className="text-sm text-ak-muted mt-1">
                Take the first step. Fill out this brief form and join Gorkhali Gym Itahari.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border-l-2 border-ak-accent text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={label}>Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Karki"
                    className="ak-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className={label}>Phone / WhatsApp Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +977 982-XXXXXXX"
                    className="ak-input pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Program / Goal</label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="ak-input"
                  >
                    <option value="General Strength & Conditioning">Strength & Conditioning</option>
                    <option value="Personal Training (1-on-1)">1-on-1 Personal Training</option>
                    <option value="Weight Loss & Transformation">Weight Loss & Transformation</option>
                    <option value="Athletic Hypertrophy & Bodybuilding">Hypertrophy & Bodybuilding</option>
                    <option value="Yoga & Athletic Mobility">Yoga & Athletic Mobility</option>
                    <option value="Nutrition & Diet Consulting">Nutrition & Diet Plan</option>
                    <option value="Monthly Club Membership">Regular Club Membership</option>
                  </select>
                </div>

                <div>
                  <label className={label}>Preferred Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="ak-input"
                  >
                    <option value="Early Morning (5:30 AM - 7:30 AM)">Early Morning (5:30 - 7:30 AM)</option>
                    <option value="Morning (7:30 AM - 10:00 AM)">Morning (7:30 - 10:00 AM)</option>
                    <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 - 4:00 PM)</option>
                    <option value="Evening (4:30 PM - 8:30 PM)">Evening (4:30 - 8:30 PM)</option>
                    <option value="Flexible / Undecided">Flexible / Any Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={label}>Fitness Goals / Notes (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your fitness background, injuries, or target goals..."
                    className="ak-input pl-10 resize-none"
                  />
                </div>
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
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Membership Application</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 text-center">
                We respect your privacy. No spam. You can also visit us directly opposite Soaltee Westend Hotel, Dharan Road.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
