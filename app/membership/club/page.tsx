'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Dumbbell, Award, Clock, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function ClubMembershipPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const settings = store.getSettings();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/membership"
            className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Memberships</span>
          </Link>

          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Club Etiquette &bull; Rules &bull; Facilities
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              The Gorkhali Club Code
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              We take pride in maintaining a disciplined, hygienic, and welcoming training atmosphere for all members in Itahari.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Member Inclusions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold uppercase text-white">Full Gym Floor Access</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Free weights, power racks, barbells, dumbbell tiers, cable machines, and cardio stations.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold uppercase text-white">Secure Lockers & Showers</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dedicated changing facilities, private day-use lockers, and clean showers for members after rigorous sessions.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold uppercase text-white">Flexible Entry Slots</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Open from 5:30 AM to 8:30 PM Sunday to Friday, and special Saturday morning hours.
              </p>
            </div>
          </div>

          {/* Club Rules */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 sm:p-12 space-y-6">
            <h3 className="text-2xl font-black uppercase text-white">Club Etiquette & Gym Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-300">
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/60">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Rerack Your Weights:</strong>
                  <span className="text-xs text-neutral-400">Always return plates, barbells, and dumbbells to their designated holders after each set.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/60">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Clean Training Shoes:</strong>
                  <span className="text-xs text-neutral-400">Outdoor muddy shoes are prohibited on the rubber lifting mats. Bring clean indoor training footwear.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/60">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Personal Towel & Hygiene:</strong>
                  <span className="text-xs text-neutral-400">Wipe down benches and machinery after intense sets to respect the next athlete.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/60">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Mutual Respect & Zero Harassment:</strong>
                  <span className="text-xs text-neutral-400">We foster a welcoming sanctuary for men and women of all experience levels.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider transition-colors inline-flex items-center space-x-2"
              >
                <span>Join Gorkhali Club Today</span>
                <ArrowRight className="w-4 h-4" />
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
