'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, ChevronRight, Trophy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function EventsPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();

  const events = store.getEvents().filter((e) => e.isPublished);

  const openApply = (title: string) => {
    setSelectedEvent(`Event Registration: ${title}`);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => openApply('General Event')} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Community &bull; Competitions &bull; Gorkhali Gym
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Gym Events & Challenges
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Join friendly gym lifting meets, deadlift challenges, fitness workshops, and outdoor bootcamps in Itahari.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8">
              <Trophy className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white uppercase">Upcoming Events Announced Soon</h3>
              <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
                Stay tuned to our notice board and Facebook page for the next lifting tournament.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 w-full bg-neutral-950">
                      <Image
                        src={evt.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                        alt={evt.title}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-2 text-xs text-red-400 font-semibold uppercase">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{evt.date}</span>
                      </div>
                      <h3 className="text-xl font-bold uppercase text-white group-hover:text-red-500 transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                        {evt.shortDesc}
                      </p>
                      <p className="text-[11px] text-neutral-500 flex items-center space-x-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{evt.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
                    <Link
                      href={`/events/${evt.slug}`}
                      className="text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                    >
                      <span>Full Schedule</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openApply(evt.title)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-red-600/20"
                    >
                      RSVP / Join
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
