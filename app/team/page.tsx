'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Users, Award, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { useCms } from '@/components/cms/CmsProvider';

export default function TeamPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string | undefined>();

  const { data } = useCms();
  const trainers = (data.trainers ?? []).filter((t) => t.isPublished);
  const settings = data.settings;

  const openApplyForCoach = (name: string) => {
    setSelectedCoach(`PT with ${name}`);
    setApplyModalOpen(true);
  };

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => openApplyForCoach('General Coach')} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            pageSlug="team"
            fallback={{
              eyebrow: 'Coaches • Mentors • Gorkhali Gym Itahari',
              heading: 'Our Certified Training Staff',
              body: 'Meet the passionate educators and conditioning specialists dedicated to guiding your form, injury prevention, and athletic performance.',
            }}
          />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((t) => (
              <div
                key={t.id}
                className="ak-panel ak-cut-tr overflow-hidden group hover:border-ak-accent/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="ak-frame ak-hover-group relative h-72 w-full">
                    <Image
                      src={t.imageUrl || '/images/trainer_coaching_session.jpg'}
                      alt={t.name}
                      fill
                      referrerPolicy="no-referrer"
                      className="ak-img object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-transparent to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-display text-2xl text-white">{t.name}</h3>
                      <p className="text-xs font-bold text-ak-accent uppercase tracking-wider mt-0.5">
                        {t.role}
                      </p>
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed">{t.bio}</p>

                    {t.qualifications && t.qualifications.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-ak-muted uppercase tracking-wider block mb-2">
                          Credentials & Experience:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {t.qualifications.map((q, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-ak-ink border border-ak-line text-[11px] text-neutral-300"
                            >
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-ak-line mt-4 flex items-center justify-between">
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20would%20like%20to%20train%20with%20coach%20${encodeURIComponent(t.name)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus text-xs font-bold text-ak-muted hover:text-white uppercase tracking-wider flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => openApplyForCoach(t.name)}
                    className="ak-btn ak-btn-primary !px-4 !py-2 !text-[11px]"
                  >
                    <span>Book Personal Training</span>
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
