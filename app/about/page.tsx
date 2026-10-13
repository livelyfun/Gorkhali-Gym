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
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      {/* Hero Header */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="ak-eyebrow mb-4">
              About Gorkhali Gym &bull; Itahari
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white mt-2">
              The Brotherhood of Strength & Discipline
            </h1>
            <p className="text-ak-muted text-base sm:text-lg mt-4 leading-relaxed">
              Founded on the legendary Gurkha principles of valor, honesty, and uncompromising endurance, Gorkhali Gym is Itahari&apos;s most respected fitness club.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Story & Philosophy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="ak-eyebrow mb-4">
                <Flame className="w-4 h-4" />
                <span>Our Heritage & Identity</span>
              </div>
              <h2 className="font-display text-3xl text-white">
                Not Just a Gym. A Sanctuary for Personal Transformation.
              </h2>
              <p className="text-ak-muted text-sm leading-relaxed">
                In a world flooded with soft shortcuts, Gorkhali Gym stands for authentic effort. Located prominently on Dharan Road opposite the Soaltee Westend Hotel, our gym was built to provide athletes, working professionals, students, and beginners with the ultimate training ecosystem.
              </p>
              <p className="text-ak-muted text-sm leading-relaxed">
                We believe that physical power breeds mental calm and resilience. Whether you are stepping under a barbell for the very first time or training for competitive physique or powerlifting goals, our coaches will treat your ambitions with deep respect and unwavering guidance.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ak-line">
                <div className="space-y-1">
                  <span className="font-display text-2xl text-white">100%</span>
                  <p className="text-xs text-ak-muted">Commitment to Member Form & Health</p>
                </div>
                <div className="space-y-1">
                  <span className="font-display text-2xl text-ak-accent">Zero Ego</span>
                  <p className="text-xs text-ak-muted">Respectful, Welcoming Brotherhood</p>
                </div>
              </div>
            </div>

            <div className="ak-frame ak-hover-group relative h-96">
              <Image
                src="/images/training_strength_gym.jpg"
                alt="Strength barbell at Gorkhali Gym"
                fill
                referrerPolicy="no-referrer"
                className="ak-img object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ak-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-widest text-ak-accent font-bold">Facility Standard</p>
                <p className="text-lg font-bold text-white">Precision Barbells, Heavy Iron & Modern Biomechanics</p>
              </div>
            </div>
          </div>

          {/* Pillars of Culture */}
          <div className="ak-panel ak-cut-tr p-8 sm:p-12">
            <h3 className="font-display text-2xl sm:text-3xl text-white text-center mb-10">
              Our Non-Negotiable Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 ak-panel ak-cut-tr p-6">
                <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-display text-lg text-white">1. Safety First, Always</h4>
                <p className="text-xs text-ak-muted leading-relaxed">
                  Heavy weight means nothing with poor technique. We instruct every lifter on spinal bracing, hip hinges, and proper mobility before adding resistance.
                </p>
              </div>

              <div className="space-y-3 ak-panel ak-cut-tr p-6">
                <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-display text-lg text-white">2. Consistency Over Hype</h4>
                <p className="text-xs text-ak-muted leading-relaxed">
                  Transformations don&apos;t happen overnight. We celebrate daily dedication, showing up at 5:30 AM, and holding each other accountable.
                </p>
              </div>

              <div className="space-y-3 ak-panel ak-cut-tr p-6">
                <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-display text-lg text-white">3. Inclusive Community</h4>
                <p className="text-xs text-ak-muted leading-relaxed">
                  From teenagers starting high school fitness to grandfathers staying mobile, Gorkhali Gym is proud to be a family-friendly space for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Location & Invitation */}
          <div className="flex flex-col md:flex-row items-center justify-between p-8 ak-cut-both bg-gradient-to-r from-red-950 via-ak-surface to-red-950 border border-ak-line gap-6">
            <div className="space-y-2">
              <h4 className="font-display text-xl text-white">Come Tour the Facility in Person</h4>
              <p className="text-xs text-ak-muted max-w-lg">
                Meet our head coach, test our equipment, and talk through your personal goals. We are opposite Soaltee Westend Hotel on Dharan Road, Itahari.
              </p>
            </div>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="ak-btn ak-btn-primary shrink-0"
            >
              <span>
                Schedule Free Gym Walkthrough
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
