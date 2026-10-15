'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Dumbbell, Award, Clock, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { useCms } from '@/components/cms/CmsProvider';

export default function ClubMembershipPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const settings = useCms().data.settings;

  if (!settings) return null;

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
            pageSlug="membership/club"
            fallback={{
              eyebrow: 'Club Etiquette • Rules • Facilities',
              heading: 'The Gorkhali Club Code',
              body: 'We take pride in maintaining a disciplined, hygienic, and welcoming training atmosphere for all members in Itahari.',
            }}
          />
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Member Inclusions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="ak-panel ak-cut-tr p-6 space-y-3">
              <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg text-white">Full Gym Floor Access</h3>
              <p className="text-xs text-ak-muted leading-relaxed">
                Free weights, power racks, barbells, dumbbell tiers, cable machines, and cardio stations.
              </p>
            </div>

            <div className="ak-panel ak-cut-tr p-6 space-y-3">
              <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg text-white">Secure Lockers & Showers</h3>
              <p className="text-xs text-ak-muted leading-relaxed">
                Dedicated changing facilities, private day-use lockers, and clean showers for members after rigorous sessions.
              </p>
            </div>

            <div className="ak-panel ak-cut-tr p-6 space-y-3">
              <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg text-white">Flexible Entry Slots</h3>
              <p className="text-xs text-ak-muted leading-relaxed">
                Open from 5:30 AM to 8:30 PM Sunday to Friday, and special Saturday morning hours.
              </p>
            </div>
          </div>

          {/* Club Rules */}
          <div className="ak-panel ak-cut-tr p-8 sm:p-12 space-y-6">
            <h3 className="font-display text-2xl text-white">Club Etiquette & Gym Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-300">
              <div className="flex items-start space-x-3 p-4 bg-ak-ink border border-ak-line">
                <CheckCircle className="w-5 h-5 text-ak-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Rerack Your Weights:</strong>
                  <span className="text-xs text-ak-muted">Always return plates, barbells, and dumbbells to their designated holders after each set.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-ak-ink border border-ak-line">
                <CheckCircle className="w-5 h-5 text-ak-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Clean Training Shoes:</strong>
                  <span className="text-xs text-ak-muted">Outdoor muddy shoes are prohibited on the rubber lifting mats. Bring clean indoor training footwear.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-ak-ink border border-ak-line">
                <CheckCircle className="w-5 h-5 text-ak-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Personal Towel & Hygiene:</strong>
                  <span className="text-xs text-ak-muted">Wipe down benches and machinery after intense sets to respect the next athlete.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-ak-ink border border-ak-line">
                <CheckCircle className="w-5 h-5 text-ak-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Mutual Respect & Zero Harassment:</strong>
                  <span className="text-xs text-ak-muted">We foster a welcoming sanctuary for men and women of all experience levels.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button
                onClick={() => setApplyModalOpen(true)}
                className="ak-btn ak-btn-primary"
              >
                <span>
                  Join Gorkhali Club Today
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
