'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Users, Award, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function TeamPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string | undefined>();

  const trainers = store.getTrainers().filter((t) => t.isPublished);
  const settings = store.getSettings();

  const openApplyForCoach = (name: string) => {
    setSelectedCoach(`PT with ${name}`);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => openApplyForCoach('General Coach')} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Coaches &bull; Mentors &bull; Gorkhali Gym Itahari
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Our Certified Training Staff
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Meet the passionate educators and conditioning specialists dedicated to guiding your form, injury prevention, and athletic performance.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((t) => (
              <div
                key={t.id}
                className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden group hover:border-red-600/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-72 w-full bg-neutral-950">
                    <Image
                      src={t.imageUrl || '/images/trainer_coaching_session.jpg'}
                      alt={t.name}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-black uppercase text-white">{t.name}</h3>
                      <p className="text-xs font-bold text-red-500 uppercase tracking-wider mt-0.5">
                        {t.role}
                      </p>
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed">{t.bio}</p>

                    {t.qualifications && t.qualifications.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                          Credentials & Experience:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {t.qualifications.map((q, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300"
                            >
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20would%20like%20to%20train%20with%20coach%20${encodeURIComponent(t.name)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => openApplyForCoach(t.name)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-red-600/20"
                  >
                    Book Personal Training
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => openApplyForCoach('General Coach')} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={selectedCoach}
      />
    </div>
  );
}
