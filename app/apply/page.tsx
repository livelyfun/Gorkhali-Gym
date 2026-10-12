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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
            Membership Application &bull; Gorkhali Gym Itahari
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
            Start Your Transformation
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
            Apply online for quick onboarding. Our team prepares your member profile and sets up your initial gym orientation.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
            {submitted ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                    Application Confirmed!
                  </h2>
                  <p className="text-neutral-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                    Welcome, <strong className="text-white">{fullName}</strong>! Your application for{' '}
                    <strong className="text-red-400">{program}</strong> has been logged into our member registry.
                  </p>
                </div>

                <div className="pt-4 max-w-sm mx-auto space-y-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
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
                    className="text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h2 className="text-2xl font-black uppercase text-white">Prospective Member Profile</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Fill in your details to secure current rate locks and orientation scheduling.
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Bishal Rai"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +977 982-XXXXXXX"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Desired Program / Plan *
                    </label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none"
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
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Preferred Training Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none"
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
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-8 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
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
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
                  <div className="flex items-center justify-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>No Obligation Tour</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Instant WhatsApp Connect</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <Dumbbell className="w-4 h-4 text-red-500" />
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
