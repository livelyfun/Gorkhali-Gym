'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dumbbell, Clock, CheckCircle, ArrowRight, ChevronRight, Flame } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function TrainingPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>();

  const programs = store.getPrograms().filter((p) => p.category === 'training' && p.isPublished);

  const openApply = (prog: string) => {
    setSelectedProgram(prog);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => openApply('General Training')} />

      {/* Header */}
      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Training Programs &bull; Gorkhali Gym
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Transformative Training Tracks
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Targeted, coach-led training structures tailored for building strength, stripping body fat, and cultivating athletic longevity.
            </p>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-neutral-950">
                    <Image
                      src={prog.imageUrl || '/images/training_strength_gym.jpg'}
                      alt={prog.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    {prog.badge && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider">
                        {prog.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    {prog.duration && (
                      <span className="inline-flex items-center space-x-1.5 text-xs text-red-400 font-semibold uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{prog.duration}</span>
                      </span>
                    )}
                    <h3 className="text-xl font-bold uppercase text-white group-hover:text-red-500 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {prog.shortDesc}
                    </p>

                    {prog.features && prog.features.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-[11px] font-bold text-neutral-300 uppercase mb-2">Program Inclusions:</h4>
                        <ul className="space-y-1.5">
                          {prog.features.slice(0, 3).map((f, idx) => (
                            <li key={idx} className="flex items-center text-xs text-neutral-300 space-x-2">
                              <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
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
                    href={`/training/${prog.slug}`}
                    className="text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Full Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openApply(prog.title)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-red-600/20"
                  >
                    {prog.ctaLabel || 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => openApply('General Training')} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={selectedProgram}
      />
    </div>
  );
}
