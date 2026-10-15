'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, CheckCircle, ArrowRight, ChevronRight, HeartPulse } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { useCms } from '@/components/cms/CmsProvider';

export default function ServicesPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();

  const { data } = useCms();
  const services = (data.programs ?? []).filter((p) => p.category === 'service' && p.isPublished);

  const openApply = (name: string) => {
    setSelectedService(name);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => openApply('General Service')} />

      {/* Header */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            pageSlug="services"
            fallback={{
              eyebrow: 'Specialized Services • Gorkhali Gym',
              heading: 'Holistic Fitness & Recovery',
              body: 'Elevate your athletic journey with dedicated 1-on-1 coaching, mobility and yoga sessions, customized meal plans, and body composition analytics.',
            }}
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="ak-panel ak-cut-tr overflow-hidden group hover:border-ak-accent/60 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="ak-frame ak-hover-group relative h-60 w-full bg-ak-ink">
                    <Image
                      src={serv.imageUrl || '/images/training_yoga_wellness.jpg'}
                      alt={serv.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="ak-img"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ak-surface via-transparent to-transparent" />
                    {serv.badge && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-ak-accent text-white text-[11px] font-extrabold uppercase tracking-wider">
                        {serv.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-xl text-white group-hover:text-ak-accent transition-colors">
                      {serv.title}
                    </h3>
                    <p className="text-xs text-ak-muted leading-relaxed line-clamp-3">
                      {serv.shortDesc}
                    </p>

                    {serv.features && serv.features.length > 0 && (
                      <div className="pt-2">
                        <ul className="space-y-1.5">
                          {serv.features.slice(0, 3).map((f, idx) => (
                            <li key={idx} className="flex items-center text-xs text-neutral-300 space-x-2">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-ak-line mt-4 flex items-center justify-between">
                  <Link
                    href={`/services/${serv.slug}`}
                    className="ak-focus ak-link text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Full Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openApply(serv.title)}
                    className="ak-btn ak-btn-primary !px-4 !py-2 !text-[11px]"
                  >
                    <span>{serv.ctaLabel || 'Book Service'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => openApply('General Service')} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={selectedService}
      />
    </div>
  );
}
