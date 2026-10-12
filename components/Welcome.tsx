'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function Welcome() {
  const features = [
    'Heavy-duty Olympic power racks and bumper plate lifting platforms',
    'Specialized 1-on-1 personal coaching with biomechanical form focus',
    'Dedicated yoga and athletic mobility recovery classes',
    'Personalized sports nutrition consulting and meal planning',
    'Spacious, ventilated training floor with locker and changing amenities',
    'Convenient location directly opposite Soaltee Westend Hotel on Dharan Road',
  ];

  return (
    <section className="py-20 bg-[#0E1118] border-t border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Introduction & Features */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
              Welcome to Gorkhali Gym
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans mb-6 leading-tight">
              A CLUB BUILT FOR DISCIPLINE, INTEGRITY & REAL PROGRESS
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Located on Dharan Road in Itahari, Gorkhali Gym is dedicated to cultivating physical power,
              endurance, and sustainable wellness. We reject quick gimmicks in favor of foundational compound
              lifting, structured coaching, and an authentic athletic community.
            </p>

            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              Whether you are an experienced lifter aiming to break personal strength records or taking your
              very first steps into physical fitness, our environment provides the equipment, space, and
              respect you need to succeed.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-red-400" />
                  </div>
                  <span className="text-xs text-neutral-300 font-medium leading-snug">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Read More Link */}
            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-red-400 group transition-colors"
              >
                <span>Read Full Story About Gorkhali Gym</span>
                <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Prominent Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl group">
            <Image
              src="/images/trainer_coaching_session_1791802649834.jpg"
              alt="Gorkhali Gym personal trainer coaching lifting form"
              fill
              referrerPolicy="no-referrer"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                Direct Supervision
              </span>
              <p className="text-base font-bold text-white leading-snug">
                Certified coaches focused on lifting mechanics, safety, and individual progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
