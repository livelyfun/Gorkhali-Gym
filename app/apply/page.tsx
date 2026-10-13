'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle,
  MessageCircle,
  Send,
  Loader2,
  ShieldCheck,
  Dumbbell,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { store } from '@/lib/data-store';

export default function ApplyPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('Monthly Club Membership');
  const [preferredTime, setPreferredTime] = useState('Morning (5:30 AM - 9:00 AM)');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          message: goals,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit application.');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or message directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const waText = encodeURIComponent(
    `Namaste Gorkhali Gym! I just submitted an application for ${program}. Name: ${fullName} (${phone}). Ready to train!`
  );
  const waUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${waText}`;

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="ak-eyebrow mb-4">
            Membership Application &bull; Gorkhali Gym Itahari
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mt-2">
            Start Your Transformation
          </h1>
          <p className="text-ak-muted text-base sm:text-lg mt-4 leading-relaxed">
            Apply online for quick onboarding. Our team prepares your member profile and sets up your initial gym orientation.
          </p>
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ak-panel ak-cut-tr p-8 sm:p-12 shadow-2xl">
            {submitted ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-white">
                    Application Confirmed!
                  </h2>
                  <p className="text-neutral-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                    Welcome, <strong className="text-white">{fullName}</strong>! Your application for{' '}
                    <strong className="text-ak-accent">{program}</strong> has been logged into our member registry.
                  </p>
                </div>

                <div className="pt-4 max-w-sm mx-auto space-y-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Open WhatsApp for Instant Confirmation</span>
                  </a>
                  <p className="text-xs text-neutral-500">
                    Direct line to Head Coach at +977 982-8405453.
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/"
                    className="ak-focus ak-link text-xs text-ak-muted hover:text-white uppercase font-bold tracking-wider"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-ak-line pb-4">
                  <h2 className="font-display text-2xl text-white">Prospective Member Profile</h2>
                  <p className="text-xs text-ak-muted mt-1">
                    Fill in your details to secure current rate locks and orientation scheduling.
                  </p>
                </div>

                {error && (
                  <div className="p-4 border-l-2 border-ak-accent bg-red-950/60 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Bishal Rai"
                      className="ak-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +977 982-XXXXXXX"
                      className="ak-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Desired Program / Plan *
                    </label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="ak-input"
                    >
                      <option value="Monthly Club Membership">Regular Monthly Membership</option>
                      <option value="3 Months Transformation Plan">3-Month Transformation Plan</option>
                      <option value="Annual Warrior Membership">Annual Warrior Membership</option>
                      <option value="Personal Training (1-on-1)">1-on-1 Personal Training</option>
                      <option value="Strength & Conditioning Special">Strength & Conditioning Track</option>
                      <option value="Yoga & Athletic Mobility">Yoga & Athletic Mobility</option>
                      <option value="Student Special Membership">Student Discount Membership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Preferred Training Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="ak-input"
                    >
                      <option value="Early Morning (5:30 AM - 7:30 AM)">Early Morning (5:30 AM - 7:30 AM)</option>
                      <option value="Morning (7:30 AM - 10:00 AM)">Morning (7:30 AM - 10:00 AM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:30 PM - 8:30 PM)">Evening (4:30 PM - 8:30 PM)</option>
                      <option value="Flexible / Undecided">Flexible / Any Time</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Fitness Background & Personal Goals (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="E.g., Goal is to lose 8kg and build bench press strength; previous back injury; complete beginner..."
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
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Official Membership Application</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-ak-line text-center text-xs text-ak-muted">
                  <div className="flex items-center justify-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>No Obligation Tour</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Instant WhatsApp Connect</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <Dumbbell className="w-4 h-4 text-ak-accent" />
                    <span>Certified Coaching</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
