'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, CheckCircle, ArrowRight, ShieldCheck, HeartHandshake, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function MembershipPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

  const plans = store.getMembershipPlans().filter((p) => p.isPublished);

  const openApply = (name: string) => {
    setSelectedPlan(name);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => openApply('General Membership')} />

      {/* Header */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="ak-eyebrow mb-4">
              Membership &bull; Gorkhali Gym Itahari
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white mt-2">
              Invest in Your Strength
            </h1>
            <p className="text-ak-muted text-base sm:text-lg mt-4 leading-relaxed">
              Transparent, straightforward memberships with full access to our weight room, cardio zones, locker facilities, and expert guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Grid */}
      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 flex flex-col justify-between transition-all ${
                  plan.isFeatured
                    ? 'ak-panel ak-cut-both border-2 border-ak-accent shadow-2xl shadow-red-950/50 scale-105 z-10'
                    : 'ak-panel ak-cut-tr'
                }`}
              >
                {plan.isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-ak-accent text-white font-black text-xs uppercase tracking-wider shadow">
                    Best Value Package
                  </span>
                )}

                <div>
                  <h3 className="font-display text-2xl text-white">{plan.name}</h3>
                  <p className="text-xs text-ak-muted mt-2 min-h-[36px]">{plan.description}</p>

                  <div className="my-6 pb-6 border-b border-ak-line">
                    <span className="font-display text-3xl sm:text-4xl text-white">
                      {plan.priceInfo || 'Inquire with Gym'}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-ak-muted uppercase tracking-wider ml-2">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm text-neutral-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-ak-accent shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => openApply(plan.name)}
                    className={`ak-btn w-full ${
                      plan.isFeatured
                        ? 'ak-btn-primary'
                        : 'ak-btn-outline'
                    }`}
                  >
                    <span>
                      Select & Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Sub-Links */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/membership/club"
              className="ak-focus p-6 ak-panel ak-cut-tr hover:border-ak-accent transition-colors flex items-center justify-between group"
            >
              <div>
                <h4 className="font-display text-base text-white group-hover:text-ak-accent transition-colors">
                  Club Membership & Gym Etiquette &rarr;
                </h4>
                <p className="text-xs text-ak-muted mt-1">
                  Learn about locker access, rules, towels, and facility guidelines.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-ak-accent group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/membership/refer-a-friend"
              className="ak-focus p-6 ak-panel ak-cut-tr hover:border-ak-accent transition-colors flex items-center justify-between group"
            >
              <div>
                <h4 className="font-display text-base text-white group-hover:text-ak-accent transition-colors">
                  Refer a Friend Program &rarr;
                </h4>
                <p className="text-xs text-ak-muted mt-1">
                  Earn bonus membership days and buddy discounts when bringing friends.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-ak-accent group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => openApply('General Membership')} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={selectedPlan}
      />
    </div>
  );
}
