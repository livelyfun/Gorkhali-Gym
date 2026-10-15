'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Flame,
  MessageCircle,
  Dumbbell,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { useCms } from '@/components/cms/CmsProvider';

export default function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const { data } = useCms();
  const programs = data.programs;
  if (!programs) return null;
  const program = programs.find((p) => p.slug === slug);

  if (!program || !program.isPublished) {
    notFound();
  }

  const settings = data.settings;
  if (!settings) return null;

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      {/* Breadcrumb & Hero */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/training"
            className="ak-focus ak-link inline-flex items-center space-x-1.5 text-xs text-ak-muted hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Programs</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-ak-accent/15 text-ak-accent border border-ak-accent/30 text-xs font-bold uppercase tracking-wider">
                {program.badge || 'Training Track'}
              </span>
              {program.duration && (
                <span className="flex items-center space-x-1 text-xs text-ak-muted">
                  <Clock className="w-3.5 h-3.5 text-ak-accent" />
                  <span>{program.duration}</span>
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-white">
              {program.title}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {program.shortDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column (2 cols) */}
            <div className="lg:col-span-2 space-y-10">
              <div className="ak-frame ak-hover-group relative h-96 w-full border border-ak-line bg-ak-surface">
                <Image
                  src={program.imageUrl || '/images/training_strength_gym.jpg'}
                  alt={program.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="ak-img"
                />
              </div>

              <div className="space-y-4">
                <h2 className="ak-heading text-2xl text-white">Overview & Blueprint</h2>
                <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {program.fullDesc || program.shortDesc}
                </div>
              </div>

              {/* What You Will Achieve */}
              {program.features && program.features.length > 0 && (
                <div className="ak-panel ak-cut-tr p-6 sm:p-8 space-y-4">
                  <h3 className="ak-heading text-lg text-white flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-ak-accent" />
                    <span>Key Inclusions & Outcomes</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {program.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-neutral-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column / Sticky CTA Sidebar */}
            <div className="space-y-6">
              <div className="ak-panel ak-cut-tr p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="ak-heading text-lg text-white">Enroll in this Track</h3>
                  <p className="text-xs text-ak-muted mt-1">
                    Book an initial movement assessment with our coaching team at Gorkhali Gym Itahari.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="ak-btn ak-btn-primary w-full"
                  >
                    <span>
                      {program.ctaLabel || 'Apply for this Program'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(program.title)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-ak-line text-xs text-ak-muted space-y-2">
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Free Technique Assessment</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Locker Room & Shower Access</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Morning & Evening Batches Available</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={program.title}
      />
    </div>
  );
}
