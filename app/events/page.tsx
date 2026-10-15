'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, ChevronRight, Trophy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { useCms } from '@/components/cms/CmsProvider';

export default function EventsPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();

  const { data } = useCms();
  const events = (data.events ?? []).filter((e) => e.isPublished);

  const openApply = (title: string) => {
    setSelectedEvent(`Event Registration: ${title}`);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => openApply('General Event')} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            pageSlug="events"
            fallback={{
              eyebrow: 'Community • Competitions • Gorkhali Gym',
              heading: 'Gym Events & Challenges',
              body: 'Join friendly gym lifting meets, deadlift challenges, fitness workshops, and outdoor bootcamps in Itahari.',
            }}
          />
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="ak-panel ak-cut-tr text-center py-16 p-8">
              <Trophy className="w-12 h-12 text-ak-accent/70 mx-auto mb-3" />
              <h3 className="font-display text-xl text-white">Upcoming Events Announced Soon</h3>
              <p className="text-sm text-ak-muted mt-1 max-w-sm mx-auto">
                Stay tuned to our notice board and Facebook page for the next lifting tournament.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="ak-panel ak-cut-tr group hover:border-ak-accent/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="ak-frame ak-hover-group relative h-56 w-full">
                      <Image
                        src={evt.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                        alt={evt.title}
                        fill
                        referrerPolicy="no-referrer"
                        className="ak-img"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-transparent to-transparent" />
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-2 text-xs text-ak-accent font-bold uppercase border-l-2 border-ak-accent pl-4">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{evt.date}</span>
                      </div>
                      <h3 className="font-display text-xl text-white group-hover:text-ak-accent transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-ak-muted leading-relaxed line-clamp-3">
                        {evt.shortDesc}
                      </p>
                      <p className="text-[11px] text-ak-muted flex items-center space-x-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-ak-muted" />
                        <span>{evt.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-4 border-t border-ak-line flex items-center justify-between">
                    <Link
                      href={`/events/${evt.slug}`}
                      className="ak-focus ak-link text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                    >
                      <span>Full Schedule</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openApply(evt.title)}
                      className="ak-btn ak-btn-primary !px-4 !py-2 !text-[11px]"
                    >
                      <span>RSVP / Join</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer onOpenApplyModal={() => openApply('General Event')} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={selectedEvent}
      />
    </div>
  );
}
