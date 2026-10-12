'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, Flame, Users, Award, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function AboutPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const settings = store.getSettings();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      {/* Hero Header */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              About Gorkhali Gym &bull; Itahari
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              The Brotherhood of Strength & Discipline
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Founded on the legendary Gurkha principles of valor, honesty, and uncompromising endurance, Gorkhali Gym is Itahari&apos;s most respected fitness club.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Story & Philosophy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Our Heritage & Identity</span>
              </div>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight">
                Not Just a Gym. A Sanctuary for Personal Transformation.
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed">
                In a world flooded with soft shortcuts, Gorkhali Gym stands for authentic effort. Located prominently on Dharan Road opposite the Soaltee Westend Hotel, our gym was built to provide athletes, working professionals, students, and beginners with the ultimate training ecosystem.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                We believe that physical power breeds mental calm and resilience. Whether you are stepping under a barbell for the very first time or training for competitive physique or powerlifting goals, our coaches will treat your ambitions with deep respect and unwavering guidance.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                <div className="space-y-1">
                  <span className="text-2xl font-black text-white">100%</span>
                  <p className="text-xs text-neutral-400">Commitment to Member Form & Health</p>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-black text-red-500">Zero Ego</span>
                  <p className="text-xs text-neutral-400">Respectful, Welcoming Brotherhood</p>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
              <Image
                src="/images/training_strength_gym.jpg"
                alt="Strength barbell at Gorkhali Gym"
                fill
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-widest text-red-500 font-bold">Facility Standard</p>
                <p className="text-lg font-bold text-white">Precision Barbells, Heavy Iron & Modern Biomechanics</p>
              </div>
            </div>
          </div>

          {/* Pillars of Culture */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white text-center mb-10">
              Our Non-Negotiable Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 bg-neutral-950 p-6 rounded-2xl border border-neutral-800/80">
                <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold uppercase text-white">1. Safety First, Always</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Heavy weight means nothing with poor technique. We instruct every lifter on spinal bracing, hip hinges, and proper mobility before adding resistance.
                </p>
              </div>

              <div className="space-y-3 bg-neutral-950 p-6 rounded-2xl border border-neutral-800/80">
                <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold uppercase text-white">2. Consistency Over Hype</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Transformations don&apos;t happen overnight. We celebrate daily dedication, showing up at 5:30 AM, and holding each other accountable.
                </p>
              </div>

              <div className="space-y-3 bg-neutral-950 p-6 rounded-2xl border border-neutral-800/80">
                <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold uppercase text-white">3. Inclusive Community</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  From teenagers starting high school fitness to grandfathers staying mobile, Gorkhali Gym is proud to be a family-friendly space for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Location & Invitation */}
          <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 border border-red-900/40 gap-6">
            <div className="space-y-2">
              <h4 className="text-xl font-bold uppercase text-white">Come Tour the Facility in Person</h4>
              <p className="text-xs text-neutral-400 max-w-lg">
                Meet our head coach, test our equipment, and talk through your personal goals. We are opposite Soaltee Westend Hotel on Dharan Road, Itahari.
              </p>
            </div>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-2"
            >
              <span>Schedule Free Gym Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
