'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { SiteSettings } from '@/lib/data-store';

interface HeroProps {
  settings: SiteSettings;
  onOpenApplyModal?: () => void;
}

export default function Hero({ settings, onOpenApplyModal }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0A0C10]">
      {/* Background Image Container with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_gorkhali_gym_1791802611195.jpg"
          alt="Gorkhali Gym barbell racks and strength arena"
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Measured dark gradient scrim for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/80 to-[#0A0C10]/50" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0C10]/60 to-[#0A0C10]/95" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 sm:pt-16">
        {/* Location Label Badge linking to Google Maps */}
        <div className="inline-flex items-center gap-2 mb-6">
          <a
            href={settings.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-700/80 text-xs font-semibold text-neutral-200 hover:text-white hover:border-red-500/80 transition-all backdrop-blur-md group"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>Itahari, Koshi Province · Dharan Road</span>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
              (Opposite Soaltee Westend)
            </span>
          </a>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight font-sans max-w-5xl mx-auto leading-none mb-6">
          DISCIPLINE. <span className="text-red-600">STRENGTH.</span> RESILIENCE.
        </h1>

        {/* Supporting Headline / Subtitle */}
        <p className="text-lg sm:text-xl font-bold text-neutral-300 max-w-2xl mx-auto mb-4 tracking-wide">
          Premier Fitness & Conditioning Facility in Itahari, Nepal
        </p>

        {/* Short Introductory Paragraph */}
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Train with heavy-duty Olympic barbells, calibrated power racks, dedicated personal coaching,
          and a community committed to real physical culture. Open daily from 5:00 AM to 9:00 PM.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          {onOpenApplyModal ? (
            <button
              type="button"
              onClick={onOpenApplyModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-xl shadow-red-950/60 uppercase tracking-wider"
            >
              <span>{settings.applyButtonLabel || 'Apply Now'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-xl shadow-red-950/60 uppercase tracking-wider"
            >
              <span>{settings.applyButtonLabel || 'Apply Now'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}

          <Link
            href="/training"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-neutral-200 bg-neutral-900/90 border border-neutral-700/80 hover:bg-neutral-800 hover:text-white transition-all backdrop-blur-md uppercase tracking-wider"
          >
            <span>Explore Programs</span>
          </Link>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-neutral-800/80 text-left">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/50">
            <Dumbbell className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Olympic Free Weights</div>
              <div className="text-[11px] text-neutral-400">Power racks & calibrated iron</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/50">
            <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Certified Guidance</div>
              <div className="text-[11px] text-neutral-400">Form correction & movement safety</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/50">
            <MapPin className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Prime Location</div>
              <div className="text-[11px] text-neutral-400">Dharan Road, opp. Soaltee Westend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
