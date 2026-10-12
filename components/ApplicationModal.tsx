'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedGoal?: string;
  preselectedOffer?: string;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  preselectedGoal = 'strength',
  preselectedOffer = '',
}: ApplicationModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState(preselectedGoal);
  const [preferredTime, setPreferredTime] = useState('morning');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceCode: string;
    whatsappRedirectUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email: email || null,
          goal,
          preferredTime,
          message: message || null,
          selectedOffer: preselectedOffer || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccessData({
        referenceCode: data.referenceCode,
        whatsappRedirectUrl: data.whatsappRedirectUrl,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0F131B] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-100 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          <div className="py-4 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              Application Submitted!
            </h3>

            <p className="text-sm text-neutral-300 max-w-sm">
              Thank you for applying to Gorkhali Gym. Your inquiry has been registered in our system.
            </p>

            <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 my-2 text-center">
              <span className="text-xs uppercase tracking-wider text-neutral-400 block mb-1">
                Your Reference Code
              </span>
              <span className="text-xl font-mono font-bold text-red-400 tracking-wider">
                {successData.referenceCode}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <a
                href={successData.whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-red-500 font-bold block mb-1">
                Gorkhali Gym Itahari
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Membership Application
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Fill in your details below to begin your training journey or schedule a facility tour.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Karki"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-sm transition-colors"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Phone / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +977 980-0000000"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-sm transition-colors"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Email Address <span className="text-neutral-500">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-sm transition-colors"
                />
              </div>

              {/* Goal & Preferred Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Primary Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500 text-sm"
                  >
                    <option value="strength">Strength & Hypertrophy</option>
                    <option value="personal-training">1-on-1 Personal Training</option>
                    <option value="yoga">Yoga & Mobility Recovery</option>
                    <option value="nutrition">Nutrition Consultation</option>
                    <option value="general-fitness">General Health & Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Preferred Time</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500 text-sm"
                  >
                    <option value="morning">Morning (5:00 AM – 10:00 AM)</option>
                    <option value="afternoon">Afternoon (11:00 AM – 4:00 PM)</option>
                    <option value="evening">Evening (4:00 PM – 9:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Message or Questions <span className="text-neutral-500">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any prior lifting experience, specific goals, or questions?"
                  className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-sm transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Membership Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
