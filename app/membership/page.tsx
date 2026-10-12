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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => openApply('General Membership')} />

      {/* Header */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Membership &bull; Gorkhali Gym Itahari
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Invest in Your Strength
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Transparent, straightforward memberships with full access to our weight room, cardio zones, locker facilities, and expert guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  plan.isFeatured
                    ? 'bg-neutral-900 border-2 border-red-600 shadow-2xl shadow-red-950/50 scale-105 z-10'
                    : 'bg-neutral-950 border border-neutral-800'
                }`}
              >
                {plan.isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow">
                    Best Value Package
                  </span>
                )}

                <div>
                  <h3 className="text-2xl font-black uppercase text-white">{plan.name}</h3>
                  <p className="text-xs text-neutral-400 mt-2 min-h-[36px]">{plan.description}</p>

                  <div className="my-6 pb-6 border-b border-neutral-800">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {plan.priceInfo || 'Inquire with Gym'}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-neutral-400 uppercase tracking-wider ml-2">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm text-neutral-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => openApply(plan.name)}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                      plan.isFeatured
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                    }`}
                  >
                    <span>Select & Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Sub-Links */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/membership/club"
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-between group"
            >
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-red-500 transition-colors uppercase">
                  Club Membership & Gym Etiquette &rarr;
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Learn about locker access, rules, towels, and facility guidelines.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/membership/refer-a-friend"
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-between group"
            >
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-red-500 transition-colors uppercase">
                  Refer a Friend Program &rarr;
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Earn bonus membership days and buddy discounts when bringing friends.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
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
