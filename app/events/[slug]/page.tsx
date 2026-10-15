'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ArrowRight, ChevronLeft, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { useCms } from '@/components/cms/CmsProvider';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const { data } = useCms();
  const events = data.events;
  if (!events) return null;
  const event = events.find((e) => e.slug === slug && e.isPublished);

  if (!event) {
    notFound();
  }

  const settings = data.settings;
  if (!settings) return null;

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="ak-focus ak-link inline-flex items-center space-x-1.5 text-xs text-ak-muted hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <div className="flex items-center space-x-3 text-xs text-ak-accent font-bold uppercase border-l-2 border-ak-accent pl-4">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.date}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{event.location}</span>
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-white">
              {event.title}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {event.shortDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="ak-frame ak-hover-group relative h-96 w-full border border-ak-line bg-ak-surface">
                <Image
                  src={event.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                  alt={event.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="ak-img"
                />
              </div>

              <div className="space-y-4">
                <h2 className="ak-heading text-2xl text-white">Event Details & Schedule</h2>
                <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {event.fullDesc || event.shortDesc}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="ak-panel ak-cut-tr p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="ak-heading text-lg text-white">Join / RSVP</h3>
                  <p className="text-xs text-ak-muted mt-1">
                    Free for current members, small entrance contribution for non-member lifters.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="ak-btn ak-btn-primary w-full"
                  >
                    <span>
                      Register for Event
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20want%20to%20register%20for%20event%3A%20${encodeURIComponent(event.title)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
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
        defaultProgram={`Event: ${event.title}`}
      />
    </div>
  );
}
