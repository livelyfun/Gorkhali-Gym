'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ArrowRight, ChevronLeft, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const event = store.getEvents().find((e) => e.slug === slug && e.isPublished);

  if (!event) {
    notFound();
  }

  const settings = store.getSettings();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <div className="flex items-center space-x-3 text-xs text-red-400 font-bold uppercase">
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
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {event.title}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {event.shortDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900">
                <Image
                  src={event.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                  alt={event.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase text-white">Event Details & Schedule</h2>
                <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {event.fullDesc || event.shortDesc}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-white">Join / RSVP</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Free for current members, small entrance contribution for non-member lifters.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>Register for Event</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20want%20to%20register%20for%20event%3A%20${encodeURIComponent(event.title)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
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
