'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { useCms } from '@/components/cms/CmsProvider';

export default function ServiceDetailPage({
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
  const service = programs.find((p) => p.slug === slug);

  if (!service || !service.isPublished) {
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="ak-focus inline-flex items-center space-x-1.5 text-xs text-ak-muted hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 bg-ak-accent text-white text-[11px] font-extrabold uppercase tracking-wider">
              {service.badge || 'Wellness & Health Service'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-white">
              {service.title}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {service.shortDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="ak-frame ak-hover-group relative h-96 w-full border border-ak-line bg-ak-surface">
                <Image
                  src={service.imageUrl || '/images/training_yoga_wellness.jpg'}
                  alt={service.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="ak-img"
                />
              </div>

              <div className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl text-white">Service Details</h2>
                <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {service.fullDesc || service.shortDesc}
                </div>
              </div>

              {service.features && service.features.length > 0 && (
                <div className="ak-panel ak-cut-bl p-6 sm:p-8 space-y-4">
                  <h3 className="font-display text-xl text-white flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-ak-accent" />
                    <span>Inclusions & Consultation Structure</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-ak-accent shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-neutral-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="ak-panel ak-cut-tr p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="font-display text-xl text-white">Book or Inquire</h3>
                  <p className="text-xs text-ak-muted mt-1">
                    Reserve an appointment with our specialist coach at Gorkhali Gym Itahari.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="ak-btn ak-btn-primary w-full"
                  >
                    <span>
                      {service.ctaLabel || 'Book Appointment'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(service.title)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ask via WhatsApp</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-ak-line text-xs text-ak-muted space-y-2">
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>One-on-one confidential consultation</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Personalized progressive roadmap</span>
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
        defaultProgram={service.title}
      />
    </div>
  );
}
