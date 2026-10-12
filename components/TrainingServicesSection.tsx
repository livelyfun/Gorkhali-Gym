'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Dumbbell, UserCheck, Flame, Apple } from 'lucide-react';
import { ProgramItem } from '@/lib/data-store';

interface TrainingServicesSectionProps {
  programs: ProgramItem[];
}

export default function TrainingServicesSection({ programs }: TrainingServicesSectionProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'strength-training':
        return <Dumbbell className="w-4 h-4 text-red-500" />;
      case 'personal-training':
        return <UserCheck className="w-4 h-4 text-red-500" />;
      case 'yoga-class':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'nutritionist':
        return <Apple className="w-4 h-4 text-red-500" />;
      default:
        return <Dumbbell className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <section className="py-24 bg-[#0A0C10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Programs & Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans">
              STRUCTURED TRAINING FOR EVERY GOAL
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            From high-load barbell progression to 1-on-1 coaching, mobility, and diet planning.
            Choose your path or consult with our trainers.
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {programs.map((prog) => {
            const href = prog.category === 'service' ? `/services/${prog.slug}` : `/training/${prog.slug}`;

            return (
              <div
                key={prog.id}
                className="group flex flex-col rounded-2xl bg-[#121620] border border-neutral-800/80 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:border-red-600/40 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={prog.imageUrl || '/images/hero_gorkhali_gym_1791802611195.jpg'}
                    alt={prog.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/20" />
                  {prog.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-red-600 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                      {prog.badge}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      {getCategoryIcon(prog.slug)}
                      <span>{prog.category === 'service' ? 'Specialized Service' : 'Training Program'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {prog.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                      {prog.shortDesc}
                    </p>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {prog.duration || 'Flexible'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-neutral-800/60 text-xs font-bold uppercase tracking-wider">
          <Link
            href="/training"
            className="text-neutral-300 hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <span>Browse All Training Programs</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </Link>
          <span className="hidden sm:inline text-neutral-700">·</span>
          <Link
            href="/services"
            className="text-neutral-300 hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <span>View All Health & Coaching Services</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}
