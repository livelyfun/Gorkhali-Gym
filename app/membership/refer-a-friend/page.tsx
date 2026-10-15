'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Gift, CheckCircle, ArrowRight, ChevronLeft, Sparkles, Send, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { useCms } from '@/components/cms/CmsProvider';

export default function ReferAFriendPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [referrerName, setReferrerName] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data } = useCms();
  const referral = data.referral;

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: friendName,
          phone: friendPhone,
          program: 'Refer-a-Friend Referral',
          preferredTime: 'Any',
          message: `Referred by active member: ${referrerName}`,
        }),
      });
      setSubmitted(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!referral) return null;

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/membership"
            className="ak-focus inline-flex items-center space-x-1.5 text-xs text-ak-muted hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Memberships</span>
          </Link>

          <PageHero
            pageSlug="membership/refer-a-friend"
            fallback={{
              eyebrow: 'Rewards Program • Gorkhali Gym',
              heading: referral.title || 'Refer a Friend & Earn Fitness Rewards',
              body:
                referral.benefitText ||
                'Bring a training partner and both receive exclusive membership perks.',
            }}
          />
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Rewards & Details */}
            <div className="space-y-8">
              <div className="ak-panel ak-cut-tr p-6 sm:p-8 space-y-4">
                <div className="inline-flex items-center space-x-2 text-ak-accent font-bold text-xs uppercase tracking-wider">
                  <Gift className="w-4 h-4" />
                  <span>How Rewards Work</span>
                </div>
                <h3 className="font-display text-2xl text-white">
                  Mutual Rewards for You &amp; Your Training Partner
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Training with a dedicated partner doubles your consistency, boosts bench press spots, and drives accountability. When your friend signs up at Gorkhali Gym, you both reap rewards.
                </p>

                <div className="pt-2 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-ak-muted">Current Benefit:</h4>
                  <div className="p-4 bg-ak-ink border border-ak-line text-sm font-semibold text-white">
                    {referral.benefitText}
                  </div>
                  <h4 className="text-xs font-bold uppercase text-ak-muted pt-2">Program Rules &amp; Details:</h4>
                  <ul className="space-y-2">
                    {referral.rules
                      ?.split('\n')
                      .filter(Boolean)
                      .map((rule, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-sm text-neutral-200">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-red-950/60 via-ak-surface to-ak-surface border border-red-900/30">
                <p className="text-xs text-ak-muted">
                  * Reward credits are applied directly to your membership account as soon as the referred friend completes their club registration at the front desk.
                </p>
              </div>
            </div>

            {/* Referral Submission Form */}
            <div className="ak-panel ak-cut-tr p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl text-white">Referral Submitted!</h3>
                  <p className="text-sm text-neutral-300 max-w-sm mx-auto">
                    Thanks <strong className="text-white">{referrerName}</strong>! We will reach out to <strong className="text-white">{friendName}</strong> with an exclusive welcome invite.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="ak-btn ak-btn-outline mt-4"
                  >
                    <span>Refer Another Friend</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReferralSubmit} className="space-y-5">
                  <div>
                    <span className="text-xs font-bold text-ak-accent uppercase tracking-wider">Fast Claim</span>
                    <h3 className="font-display text-xl text-white mt-1">Submit Friend Details</h3>
                    <p className="text-xs text-ak-muted mt-1">
                      Give us your friend&apos;s details and we&apos;ll schedule them for a complimentary orientation session!
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Your Name (Current Member) *
                    </label>
                    <input
                      type="text"
                      required
                      value={referrerName}
                      onChange={(e) => setReferrerName(e.target.value)}
                      placeholder="e.g. Milan Thapa"
                      className="ak-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Friend&apos;s Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="e.g. Suman Rai"
                      className="ak-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Friend&apos;s Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={friendPhone}
                      onChange={(e) => setFriendPhone(e.target.value)}
                      placeholder="e.g. +977 980-XXXXXXX"
                      className="ak-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="ak-btn ak-btn-primary w-full"
                  >
                    <span>
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Referral Invitation</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
