'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, CheckCircle, ArrowRight, ChevronRight, HeartPulse } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function ServicesPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();

  const services = store.getPrograms().filter((p) => p.category === 'service' && p.isPublished);

  const openApply = (name: string) => {
    setSelectedService(name);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => openApply('General Service')} />

      {/* Header */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Specialized Services &bull; Gorkhali Gym
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Holistic Fitness & Recovery
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Elevate your athletic journey with dedicated 1-on-1 coaching, mobility and yoga sessions, customized meal plans, and body composition analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-neutral-950">
                    <Image
                      src={serv.imageUrl || '/images/training_yoga_wellness.jpg'}
                      alt={serv.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    {serv.badge && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider">
                        {serv.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold uppercase text-white group-hover:text-red-500 transition-colors">
                      {serv.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
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

                <div className="p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
                  <Link
                    href={`/services/${serv.slug}`}
                    className="text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Full Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openApply(serv.title)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-red-600/20"
                  >
                    {serv.ctaLabel || 'Book Service'}
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
