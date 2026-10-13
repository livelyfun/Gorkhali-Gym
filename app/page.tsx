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

  const sectionHeader =
    'flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14';

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => openApply()} />

      {/* HERO SECTION */}
      {heroSec?.isVisible !== false && (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-24">
          {/* Background Image with Dark Vignette Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroSec?.imageUrl || '/images/hero_gorkhali_gym.jpg'}
              alt="Gorkhali Gym Heavy Iron Training Facility Itahari"
              fill
              priority
              referrerPolicy="no-referrer"
              className="object-cover object-center scale-105 filter brightness-[0.34] contrast-[1.15] grayscale-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ak-ink via-ak-ink/85 to-ak-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-transparent to-ak-ink/70" />
            <div className="absolute inset-0 ak-stripe opacity-40" />
          </div>

          {/* Angular red accent */}
          <div className="hidden lg:block absolute top-0 right-0 h-full w-1/3 z-0 pointer-events-none">
            <div className="absolute right-[-6rem] top-1/4 h-[120%] w-24 bg-ak-accent/10 skew-x-[-14deg]" />
            <div className="absolute right-24 top-1/4 h-[120%] w-2 bg-ak-accent/40 skew-x-[-14deg]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-8">
                {/* Badge */}
                <div className="ak-eyebrow mb-6">
                  <Flame className="w-4 h-4" />
                  <span>Itahari&apos;s Elite Strength Club &bull; Koshi Province</span>
                </div>

                {/* Headline */}
                <h1 className="font-display uppercase text-white leading-[0.92] text-5xl sm:text-7xl lg:text-8xl tracking-tight">
                  {heroSec?.heading || (
                    <>
                      Forged in{' '}
                      <span className="text-ak-accent drop-shadow-[0_0_35px_rgba(239,68,68,0.45)]">
                        Discipline
                      </span>
                      .
                      <br />
                      Built for Strength.
                    </>
                  )}
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg text-ak-muted max-w-2xl mt-8 leading-relaxed border-l-2 border-ak-accent pl-5">
                  {heroSec?.bodyText || (
                    <>
                      Welcome to <strong className="text-white">{settings.gymName || 'Gorkhali Gym'}</strong>. Professional
                      coaching, Olympic-grade iron, personal training, and a brotherhood of relentless work ethic right
                      opposite Soaltee Westend Hotel, Itahari.
                    </>
                  )}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-10">
                  <button onClick={() => openApply()} className="ak-btn ak-btn-primary text-sm sm:text-base">
                    <span>
                      {heroSec?.ctaLabel || settings.applyButtonLabel || 'Apply for Membership'}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </button>
                  <Link href={heroSec?.ctaUrl || '/training'} className="ak-btn ak-btn-outline text-sm sm:text-base">
                    <span>
                      <Dumbbell className="w-5 h-5 text-ak-accent" />
                      Explore Programs
                    </span>
                  </Link>
                </div>
              </div>

              {/* Trust Highlights Strip */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-px bg-ak-line border border-ak-line">
                <div className="bg-ak-ink/80 backdrop-blur-sm p-5">
                  <span className="font-display text-3xl text-ak-accent">5:30 AM</span>
                  <span className="block text-[10px] text-ak-muted uppercase tracking-[0.18em] mt-1">
                    Early Birds Opening
                  </span>
                </div>
                <div className="bg-ak-ink/80 backdrop-blur-sm p-5">
                  <span className="font-display text-3xl text-white">1-on-1</span>
                  <span className="block text-[10px] text-ak-muted uppercase tracking-[0.18em] mt-1">
                    Dedicated PT Coaches
                  </span>
                </div>
                <div className="bg-ak-ink/80 backdrop-blur-sm p-5">
                  <span className="font-display text-3xl text-white">100%</span>
                  <span className="block text-[10px] text-ak-muted uppercase tracking-[0.18em] mt-1">
                    Real Iron &amp; Racks
                  </span>
                </div>
                <div className="bg-ak-ink/80 backdrop-blur-sm p-5">
                  <span className="font-display text-3xl text-ak-accent">4.9 &starf;</span>
                  <span className="block text-[10px] text-ak-muted uppercase tracking-[0.18em] mt-1">
                    Top Rated in Itahari
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: MANAGED INTRO HIGHLIGHT */}
      {introSec && introSec.isVisible !== false && (
        <section className="bg-ak-surface-2 border-y border-ak-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="ak-panel ak-cut-tr p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="ak-eyebrow">{introSec.subheading || 'Why Gorkhali Gym is different'}</span>
                <h2 className="ak-heading text-2xl sm:text-3xl text-white mt-3">{introSec.heading}</h2>
                <p className="text-sm text-ak-muted leading-relaxed">{introSec.bodyText}</p>
              </div>
              {introSec.ctaLabel && (
                <Link href={introSec.ctaUrl || '/training'} className="ak-btn ak-btn-primary shrink-0">
                  <span>
                    {introSec.ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PROMOTIONAL OFFER BANNER (If published) */}
      {offers.length > 0 && (
        <section className="relative bg-ak-surface border-y border-ak-line overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/4 ak-stripe opacity-60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="px-3 py-1 bg-ak-accent text-white font-extrabold text-xs uppercase tracking-wider shrink-0 skew-x-[-8deg]">
                <span className="inline-block -skew-x-[-8deg]">{offers[0].badge || 'Special Offer'}</span>
              </span>
              <div>
                <p className="font-bold text-white text-sm sm:text-base">
                  {offers[0].title} — <span className="text-ak-accent">{offers[0].discountInfo || offers[0].shortDesc}</span>
                </p>
                {offers[0].validUntil && (
                  <p className="text-xs text-ak-muted">Valid until: {offers[0].validUntil}</p>
                )}
              </div>
            </div>
            <Link
              href={`/offers/${offers[0].slug}`}
              className="ak-focus inline-flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              <span>Claim Deal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* SECTION: CORE TRAINING PROGRAMS */}
      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={sectionHeader}>
            <div>
              <div className="ak-eyebrow mb-4">
                <Flame className="w-4 h-4" />
                <span>Engineered for Results</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white">Featured Training Disciplines</h2>
              <p className="text-ak-muted text-sm sm:text-base max-w-xl mt-4">
                Whether your target is raw powerlifting strength, athletic hypertrophy, or total body fat loss, we have
                the specialized track for you.
              </p>
            </div>
            <Link
              href="/training"
              className="ak-focus ak-link inline-flex items-center gap-2 text-ak-accent hover:text-white font-bold text-sm uppercase tracking-wider group shrink-0"
            >
              <span>View All Training Programs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingPrograms.map((prog) => (
              <div
                key={prog.id}
                className="group ak-panel ak-cut-tr flex flex-col hover:border-ak-accent/60 transition-colors"
              >
                <div className="ak-frame ak-hover-group relative h-56 w-full">
                  <Image
                    src={prog.imageUrl || '/images/training_strength_gym.jpg'}
                    alt={prog.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="ak-img filter brightness-90 grayscale-[0.25] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-ak-ink/20 to-transparent" />
                  {prog.badge && (
                    <span className="absolute top-0 right-0 px-3 py-1.5 bg-ak-accent text-white font-extrabold text-[11px] uppercase tracking-wider">
                      {prog.badge}
                    </span>
                  )}
                  {prog.duration && (
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-neutral-300 font-medium text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-ak-accent" />
                      <span>{prog.duration}</span>
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl text-white group-hover:text-ak-accent transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-ak-muted mt-2 line-clamp-3 leading-relaxed">{prog.shortDesc}</p>

                    {prog.features && prog.features.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {prog.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center text-xs text-neutral-300 gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-ak-accent shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-ak-line flex items-center justify-between">
                    <Link
                      href={`/training/${prog.slug}`}
                      className="ak-focus text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => openApply(prog.title)} className="ak-btn ak-btn-outline !px-4 !py-2 !text-[11px]">
                      <span>{prog.ctaLabel || 'Apply Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: SERVICES & WELLNESS */}
      <section className="py-24 bg-ak-surface-2 border-y border-ak-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={sectionHeader}>
            <div>
              <div className="ak-eyebrow mb-4">
                <HeartPulse className="w-4 h-4" />
                <span>Complete Health &amp; Recovery</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white">Specialized Gym Services</h2>
              <p className="text-ak-muted text-sm sm:text-base max-w-xl mt-4">
                Holistic fitness requires recovery, correct mobility, and calibrated nutrition. Experience our supportive
                health services.
              </p>
            </div>
            <Link
              href="/services"
              className="ak-focus ak-link inline-flex items-center gap-2 text-ak-accent hover:text-white font-bold text-sm uppercase tracking-wider group shrink-0"
            >
              <span>All Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePrograms.map((serv) => (
              <div
                key={serv.id}
                className="ak-panel ak-cut-bl p-6 hover:border-ak-accent/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-ak-accent/10 border border-ak-accent/30 flex items-center justify-center text-ak-accent mb-4 skew-x-[-8deg]">
                    <Sparkles className="w-6 h-6 -skew-x-[-8deg]" />
                  </div>
                  <h3 className="font-display text-xl text-white mb-2">{serv.title}</h3>
                  <p className="text-sm text-ak-muted leading-relaxed mb-4">{serv.shortDesc}</p>
                  {serv.features && (
                    <ul className="space-y-1.5 text-xs text-neutral-300 mb-6">
                      {serv.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-ak-line">
                  <Link
                    href={`/services/${serv.slug}`}
                    className="ak-focus text-xs font-bold text-ak-muted hover:text-white uppercase tracking-wider"
                  >
                    Details &amp; Schedule
                  </Link>
                  <button onClick={() => openApply(serv.title)} className="ak-btn ak-btn-outline !px-4 !py-2 !text-[11px]">
                    <span>Book Consultation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: WHY GORKHALI GYM / VALUE PILLARS */}
      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="ak-eyebrow mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Built by Gurkhas, For Champions</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl text-white">Why Train at Gorkhali Gym?</h2>
            <p className="text-ak-muted text-sm sm:text-base mt-4">
              We reject noisy gimmicks. We cultivate a serious, motivating sanctuary where everyday people transform into
              their strongest version.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ak-line border border-ak-line">
            <div className="bg-ak-ink p-7 group hover:bg-ak-surface transition-colors">
              <div className="font-display text-4xl text-ak-accent/70 group-hover:text-ak-accent transition-colors">
                01
              </div>
              <h3 className="font-display text-lg text-white mt-4">Elite Equipment</h3>
              <p className="text-xs text-ak-muted leading-relaxed mt-2">
                Full array of Olympic bumper plates, calibrated steel barbells, power racks, dumbbell racks up to 50kg, and
                smooth pulley systems.
              </p>
            </div>

            <div className="bg-ak-ink p-7 group hover:bg-ak-surface transition-colors">
              <div className="font-display text-4xl text-ak-accent/70 group-hover:text-ak-accent transition-colors">
                02
              </div>
              <h3 className="font-display text-lg text-white mt-4">Authentic Coaching</h3>
              <p className="text-xs text-ak-muted leading-relaxed mt-2">
                Coaches who demonstrate with proper biomechanics, safe lifting techniques, posture correction, and
                progressive overload.
              </p>
            </div>

            <div className="bg-ak-ink p-7 group hover:bg-ak-surface transition-colors">
              <div className="font-display text-4xl text-ak-accent/70 group-hover:text-ak-accent transition-colors">
                03
              </div>
              <h3 className="font-display text-lg text-white mt-4">Discipline &amp; Respect</h3>
              <p className="text-xs text-ak-muted leading-relaxed mt-2">
                Zero harassment, zero ego. Every member reracks weights and supports fellow lifters, creating a safe family
                environment for women and men.
              </p>
            </div>

            <div className="bg-ak-ink p-7 group hover:bg-ak-surface transition-colors">
              <div className="font-display text-4xl text-ak-accent/70 group-hover:text-ak-accent transition-colors">
                04
              </div>
              <h3 className="font-display text-lg text-white mt-4">Prime Location</h3>
              <p className="text-xs text-ak-muted leading-relaxed mt-2">
                Strategically located right on Dharan Road opposite Soaltee Westend Hotel, easily accessible with ample
                two-wheeler and vehicle parking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: MEMBERSHIP PLANS */}
      <section className="py-24 bg-ak-surface-2 border-y border-ak-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="ak-eyebrow mb-4">
              <Award className="w-4 h-4" />
              <span>Transparent &amp; Accessible</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl text-white">Membership Options</h2>
            <p className="text-ak-muted text-sm sm:text-base mt-4">
              Flexible options crafted to fit your lifestyle, budget, and long-term athletic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 flex flex-col justify-between ${
                  plan.isFeatured
                    ? 'ak-panel ak-cut-both border-2 border-ak-accent lg:-mt-4'
                    : 'ak-panel ak-cut-tr'
                }`}
              >
                {plan.isFeatured && (
                  <span className="absolute -top-0.5 right-6 px-3 py-1 bg-ak-accent text-white font-black text-[10px] uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-display text-2xl text-white">{plan.name}</h3>
                  <p className="text-xs text-ak-muted mt-2 min-h-[36px]">{plan.description}</p>

                  <div className="my-6 pb-6 border-b border-ak-line">
                    <span className="font-display text-4xl text-white">{plan.priceInfo || 'Inquire with Gym'}</span>
                    {plan.period && (
                      <span className="text-xs text-ak-muted uppercase tracking-wider ml-2">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm text-neutral-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
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
                      plan.isFeatured ? 'ak-btn-primary' : 'ak-btn-outline'
                    }`}
                  >
                    <span>
                      Choose Plan &amp; Apply
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-ak-muted">
              Need custom corporate plans or student discounts?{' '}
              <Link
                href="/membership/refer-a-friend"
                className="ak-focus text-ak-accent hover:text-white font-bold underline decoration-ak-accent underline-offset-2 transition-colors"
              >
                Check our Refer-a-Friend Rewards &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: MEET THE COACHES */}
      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={sectionHeader}>
            <div>
              <div className="ak-eyebrow mb-4">
                <Users className="w-4 h-4" />
                <span>Knowledge &bull; Dedication &bull; Support</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white">Our Certified Trainers</h2>
              <p className="text-ak-muted text-sm sm:text-base max-w-xl mt-4">
                Real mentors who guide your lifts, refine your nutrition, and hold you accountable to your personal best.
              </p>
            </div>
            <Link
              href="/team"
              className="ak-focus ak-link inline-flex items-center gap-2 text-ak-accent hover:text-white font-bold text-sm uppercase tracking-wider group shrink-0"
            >
              <span>Meet Entire Team</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="ak-panel ak-cut-tr overflow-hidden group hover:border-ak-accent/50 transition-colors flex flex-col justify-between"
              >
                <div className="ak-frame ak-hover-group relative h-72 w-full">
                  <Image
                    src={trainer.imageUrl || '/images/trainer_coaching_session.jpg'}
                    alt={trainer.name}
                    fill
                    referrerPolicy="no-referrer"
                    className="ak-img filter grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-ak-ink/20 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl text-white">{trainer.name}</h3>
                    <p className="text-xs font-bold text-ak-accent uppercase tracking-[0.16em] mt-1">{trainer.role}</p>
                    <p className="text-xs text-ak-muted mt-2 line-clamp-3">{trainer.bio}</p>
                  </div>
                  <div className="pt-3 border-t border-ak-line flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      {trainer.qualifications?.[0] || 'Certified Coach'}
                    </span>
                    <button
                      onClick={() => openApply(`PT with ${trainer.name}`)}
                      className="ak-focus text-xs font-bold text-ak-accent hover:text-white uppercase tracking-wider transition-colors"
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
      <section className="py-24 bg-ak-surface-2 border-y border-ak-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={sectionHeader}>
            <div>
              <div className="ak-eyebrow mb-4">
                <Star className="w-4 h-4 fill-ak-accent" />
                <span>Authentic Member Stories</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white">What Our Members Say</h2>
              <p className="text-ak-muted text-sm sm:text-base max-w-xl mt-4">
                Real lifters from Itahari, Dharan, and across Koshi Province who achieved genuine strength and physique
                goals.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => setReviewModalOpen(true)} className="ak-btn ak-btn-outline">
                <span>Leave a Review</span>
              </button>
              <Link
                href="/reviews"
                className="ak-focus ak-link inline-flex items-center gap-1 text-ak-accent hover:text-white font-bold text-xs uppercase tracking-wider"
              >
                <span>All Reviews ({reviews.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div key={rev.id} className="ak-panel ak-cut-tr p-6 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed italic">&ldquo;{rev.content}&rdquo;</p>
                </div>
                <div className="pt-3 border-t border-ak-line flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{rev.authorName}</h4>
                    <span className="text-[11px] text-neutral-500">{rev.role || 'Member'}</span>
                  </div>
                  <span className="text-[10px] text-ak-accent uppercase font-bold tracking-wider">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 bg-ak-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="ak-eyebrow mb-4">
              <ChevronRight className="w-4 h-4" />
              <span>Answers</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white">Got Questions?</h2>
            <p className="text-ak-muted text-sm mt-3">
              Everything you need to know about joining Gorkhali Gym Itahari.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group ak-panel ak-cut-bl p-5 border-l-2 border-l-transparent open:border-l-ak-accent transition-colors"
              >
                <summary className="ak-focus flex items-center justify-between cursor-pointer list-none text-white font-display text-base uppercase select-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-ak-muted group-open:rotate-90 group-open:text-ak-accent transition-transform shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-sm text-ak-muted leading-relaxed pt-3 border-t border-ak-line">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/faq"
              className="ak-focus ak-link text-xs text-ak-accent hover:text-white uppercase font-bold tracking-wider transition-colors"
            >
              Browse Complete FAQ Directory &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: LOCATION & MAP STRIP */}
      <section className="py-16 bg-ak-surface-2 border-t border-ak-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ak-panel ak-slant-r p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="ak-eyebrow">
                <MapPin className="w-4 h-4" />
                <span>Physical Gym Location</span>
              </div>
              <h3 className="font-display text-3xl text-white">Visit Us in Itahari</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{settings.address}</p>
              <div className="text-xs text-ak-muted space-y-1">
                <p>
                  <strong className="text-neutral-300">Operating Hours:</strong> {settings.openingHours}
                </p>
                <p>
                  <strong className="text-neutral-300">Phone:</strong> {settings.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ak-focus px-6 py-3.5 bg-white hover:bg-neutral-200 text-neutral-950 font-black text-xs uppercase tracking-wider text-center transition-colors"
              >
                Open Google Maps
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="ak-focus px-6 py-3.5 bg-ak-ink border border-ak-line hover:border-ak-accent text-white font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-ak-accent" />
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
      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />
    </div>
  );
}
