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
import { store } from '@/lib/data-store';

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const service = store.getProgramBySlug(slug);

  if (!service || !service.isPublished) {
    notFound();
  }

  const settings = store.getSettings();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      {/* Breadcrumb & Hero */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <span className="px-3 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
              {service.badge || 'Wellness & Health Service'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {service.title}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {service.shortDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900">
                <Image
                  src={service.imageUrl || '/images/training_yoga_wellness.jpg'}
                  alt={service.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase text-white">Service Details</h2>
                <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {service.fullDesc || service.shortDesc}
                </div>
              </div>

              {service.features && service.features.length > 0 && (
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-lg font-bold uppercase text-white flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-red-500" />
                    <span>Inclusions & Consultation Structure</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-neutral-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-white">Book or Inquire</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Reserve an appointment with our specialist coach at Gorkhali Gym Itahari.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>{service.ctaLabel || 'Book Appointment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(service.title)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ask via WhatsApp</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400 space-y-2">
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
