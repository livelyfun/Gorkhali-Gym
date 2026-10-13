'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dumbbell,
  ShieldCheck,
  Flame,
  Award,
  Users,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  MapPin,
  ChevronRight,
  HeartPulse,
  Sparkles,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import ReviewModal from '@/components/ReviewModal';
import { store } from '@/lib/data-store';

export default function HomePage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>();

  const settings = store.getSettings();
  const sections = store.getSections('home');
  const getSection = (key: string) => sections.find((s) => s.sectionKey === key);
  const heroSec = getSection('hero');
  const introSec = getSection('intro');
  const ctaSec = getSection('cta');

  const programs = store.getPrograms().filter((p) => p.isPublished);
  const trainingPrograms = programs.filter((p) => p.category === 'training');
  const servicePrograms = programs.filter((p) => p.category === 'service');
  const plans = store.getMembershipPlans().filter((p) => p.isPublished);
  const trainers = store.getTrainers().filter((t) => t.isPublished);
  const reviews = store.getReviews().filter((r) => r.isPublished);
  const offers = store.getOffers().filter((o) => o.isPublished);
  const faqs = store.getFaqs().filter((f) => f.isPublished).slice(0, 5);

  const openApply = (progName?: string) => {
    setSelectedProgram(progName || 'General Strength & Conditioning');
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => openApply()} />

      {/* HERO SECTION */}
      {heroSec?.isVisible !== false && (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-20">
          {/* Background Image with Dark Vignette Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroSec?.imageUrl || "/images/hero_gorkhali_gym.jpg"}
              alt="Gorkhali Gym Heavy Iron Training Facility Itahari"
              fill
              priority
              referrerPolicy="no-referrer"
              className="object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/80" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/40 to-neutral-950" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg shadow-orange-950/50 backdrop-blur-sm">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>Itahari&apos;s Elite Strength & Fitness Club &bull; Koshi Province</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
              {heroSec?.heading || (
                <>
                  Forged in <span className="text-orange-600 drop-shadow-[0_0_35px_rgba(234,88,12,0.4)]">Discipline</span>.
                  <br />
                  Built for <span className="text-neutral-100">Strength</span>.
                </>
              )}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {heroSec?.bodyText || (
                <>
                  Welcome to <strong>{settings.gymName || 'Gorkhali Gym'}</strong>. Professional coaching, Olympic-grade iron, personal training, and a brotherhood of relentless work ethic right opposite Soaltee Westend Hotel, Itahari.
                </>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openApply()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-extrabold text-base uppercase tracking-wider shadow-xl shadow-orange-600/40 transition-all flex items-center justify-center space-x-3 group"
              >
                <span>{heroSec?.ctaLabel || settings.applyButtonLabel || 'Apply for Membership'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href={heroSec?.ctaUrl || "/training"}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-base uppercase tracking-wider transition-all flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <Dumbbell className="w-5 h-5 text-orange-500" />
                <span>Explore Programs</span>
              </Link>
            </div>

            {/* Trust Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-neutral-800/80">
              <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60">
                <span className="text-2xl sm:text-3xl font-black text-orange-500">5:30 AM</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Early Birds Opening</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60">
                <span className="text-2xl sm:text-3xl font-black text-white">1-on-1</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Dedicated PT Coaches</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60">
                <span className="text-2xl sm:text-3xl font-black text-white">100%</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Real Iron & Racks</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60">
                <span className="text-2xl sm:text-3xl font-black text-orange-500">4.9 &starf;</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Top Rated in Itahari</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: MANAGED INTRO HIGHLIGHT */}
      {introSec && introSec.isVisible !== false && (
        <section className="py-12 bg-neutral-900/40 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-orange-500 font-bold text-xs uppercase tracking-wider">
                  {introSec.subheading || 'Why Gorkhali Gym is different'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                  {introSec.heading}
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {introSec.bodyText}
                </p>
              </div>
              {introSec.ctaLabel && (
                <Link
                  href={introSec.ctaUrl || '/training'}
                  className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-wider whitespace-nowrap transition-colors shadow-lg shadow-orange-950 shrink-0"
                >
                  {introSec.ctaLabel} &rarr;
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PROMOTIONAL OFFER BANNER (If published) */}
      {offers.length > 0 && (
        <section className="bg-gradient-to-r from-red-900/70 via-neutral-900 to-red-900/70 border-y border-orange-800/50 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <span className="px-2.5 py-1 rounded bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider shrink-0">
                {offers[0].badge || 'Special Offer'}
              </span>
              <div>
                <p className="font-bold text-white text-sm sm:text-base">
                  {offers[0].title} — <span className="text-orange-400">{offers[0].discountInfo || offers[0].shortDesc}</span>
                </p>
                {offers[0].validUntil && (
                  <p className="text-xs text-neutral-400">Valid until: {offers[0].validUntil}</p>
                )}
              </div>
            </div>
            <Link
              href={`/offers/${offers[0].slug}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              <span>Claim Deal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* SECTION: CORE TRAINING PROGRAMS */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4" />
                <span>Engineered for Results</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Featured Training Disciplines
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-2">
                Whether your target is raw powerlifting strength, athletic hypertrophy, or total body fat loss, we have the specialized track for you.
              </p>
            </div>
            <Link
              href="/training"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-orange-500 hover:text-orange-400 font-bold text-sm uppercase tracking-wider group"
            >
              <span>View All Training Programs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingPrograms.map((prog) => (
              <div
                key={prog.id}
                className="group relative bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden hover:border-orange-600/50 transition-all flex flex-col shadow-lg"
              >
                <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
                  <Image
                    src={prog.imageUrl || '/images/training_strength_gym.jpg'}
                    alt={prog.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  {prog.badge && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded bg-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow">
                      {prog.badge}
                    </span>
                  )}
                  {prog.duration && (
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-neutral-300 font-medium text-xs flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span>{prog.duration}</span>
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-black uppercase text-white group-hover:text-orange-500 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                      {prog.shortDesc}
                    </p>

                    {prog.features && prog.features.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {prog.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center text-xs text-neutral-300 space-x-2">
                            <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <Link
                      href={`/training/${prog.slug}`}
                      className="text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                    >
                      <span>Learn More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => openApply(prog.title)}
                      className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-orange-600/20"
                    >
                      {prog.ctaLabel || 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: SERVICES & WELLNESS */}
      <section className="py-20 bg-neutral-900/50 border-t border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">
                <HeartPulse className="w-4 h-4" />
                <span>Complete Health & Recovery</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Specialized Gym Services
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-2">
                Holistic fitness requires recovery, correct mobility, and calibrated nutrition. Experience our supportive health services.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-orange-500 hover:text-orange-400 font-bold text-sm uppercase tracking-wider group"
            >
              <span>All Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePrograms.map((serv) => (
              <div
                key={serv.id}
                className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-6 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white mb-2">{serv.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">{serv.shortDesc}</p>
                  {serv.features && (
                    <ul className="space-y-1.5 text-xs text-neutral-300 mb-6">
                      {serv.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
                  <Link
                    href={`/services/${serv.slug}`}
                    className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
                  >
                    Details & Schedule
                  </Link>
                  <button
                    onClick={() => openApply(serv.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: WHY GORKHALI GYM / VALUE PILLARS */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Built by Gurkhas, For Champions</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Why Train at Gorkhali Gym?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-3">
              We reject noisy gimmicks. We cultivate a serious, motivating sanctuary where everyday people transform into their strongest version.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-500 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-lg font-bold uppercase text-white">Elite Equipment</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full array of Olympic bumper plates, calibrated steel barbells, power racks, dumbbell racks up to 50kg, and smooth pulley systems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-500 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-lg font-bold uppercase text-white">Authentic Coaching</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Coaches who demonstrate with proper biomechanics, safe lifting techniques, posture correction, and progressive overload.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-500 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-lg font-bold uppercase text-white">Discipline & Respect</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Zero harassment, zero ego. Every member reracks weights and supports fellow lifters, creating a safe family environment for women and men.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-500 flex items-center justify-center font-black">
                04
              </div>
              <h3 className="text-lg font-bold uppercase text-white">Prime Location</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Strategically located right on Dharan Road opposite Soaltee Westend Hotel, easily accessible with ample two-wheeler and vehicle parking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: MEMBERSHIP PLANS */}
      <section className="py-20 bg-neutral-900/40 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Transparent & Accessible</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Membership Options
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-3">
              Flexible options crafted to fit your lifestyle, budget, and long-term athletic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all ${
                  plan.isFeatured
                    ? 'bg-neutral-900 border-2 border-orange-600 shadow-2xl shadow-orange-950/50 scale-105 z-10'
                    : 'bg-neutral-950 border border-neutral-800'
                }`}
              >
                {plan.isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow">
                    Most Popular Choice
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
                        <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
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
                        ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                    }`}
                  >
                    <span>Choose Plan & Apply</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-neutral-400">
              Need custom corporate plans or student discounts?{' '}
              <Link href="/membership/refer-a-friend" className="text-orange-500 hover:underline font-bold">
                Check our Refer-a-Friend Rewards &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: MEET THE COACHES */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Users className="w-4 h-4" />
                <span>Knowledge &bull; Dedication &bull; Support</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Our Certified Trainers
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-2">
                Real mentors who guide your lifts, refine your nutrition, and hold you accountable to your personal best.
              </p>
            </div>
            <Link
              href="/team"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-orange-500 hover:text-orange-400 font-bold text-sm uppercase tracking-wider"
            >
              <span>Meet Entire Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-orange-600/50 transition-all flex flex-col justify-between"
              >
                <div className="relative h-64 w-full bg-neutral-950">
                  <Image
                    src={trainer.imageUrl || '/images/trainer_coaching_session.jpg'}
                    alt={trainer.name}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xl font-bold uppercase text-white">{trainer.name}</h3>
                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mt-0.5">
                      {trainer.role}
                    </p>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-3">{trainer.bio}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      {trainer.qualifications?.[0] || 'Certified Coach'}
                    </span>
                    <button
                      onClick={() => openApply(`PT with ${trainer.name}`)}
                      className="text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-wider"
                    >
                      Book Session &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: MEMBER REVIEWS & COMMUNITY */}
      <section className="py-20 bg-neutral-900/60 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Star className="w-4 h-4 fill-red-500" />
                <span>Authentic Member Stories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                What Our Members Say
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-2">
                Real lifters from Itahari, Dharan, and across Koshi Province who achieved genuine strength and physique goals.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider border border-neutral-700 transition-colors"
              >
                Leave a Review
              </button>
              <Link
                href="/reviews"
                className="text-orange-500 hover:text-orange-400 font-bold text-xs uppercase tracking-wider flex items-center space-x-1"
              >
                <span>All Reviews ({reviews.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed italic">
                    &ldquo;{rev.content}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{rev.authorName}</h4>
                    <span className="text-[11px] text-neutral-500">{rev.role || 'Member'}</span>
                  </div>
                  <span className="text-[10px] text-neutral-600 uppercase font-semibold">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Got Questions?
            </h2>
            <p className="text-neutral-400 text-sm mt-2">
              Everything you need to know about joining Gorkhali Gym Itahari.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group p-5 rounded-xl bg-neutral-900 border border-neutral-800 transition-colors open:border-neutral-700"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-white font-bold text-base select-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-neutral-500 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed pt-2 border-t border-neutral-800/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="text-xs text-orange-500 hover:underline uppercase font-bold tracking-wider"
            >
              Browse Complete FAQ Directory &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: LOCATION & MAP STRIP */}
      <section className="py-16 bg-neutral-900/30 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-orange-600/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Physical Gym Location</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
                Visit Us in Itahari
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {settings.address}
              </p>
              <div className="text-xs text-neutral-400 space-y-1">
                <p><strong>Operating Hours:</strong> {settings.openingHours}</p>
                <p><strong>Phone:</strong> {settings.phone}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-black text-xs uppercase tracking-wider text-center transition-colors shadow-lg"
              >
                Open Google Maps
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4 text-orange-500" />
                <span>Call Front Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => openApply()} />

      {/* MODALS */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={selectedProgram}
      />
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
}
