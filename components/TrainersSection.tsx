'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { TrainerItem } from '@/lib/data-store';

interface TrainersSectionProps {
  trainers: TrainerItem[];
}

export default function TrainersSection({ trainers }: TrainersSectionProps) {
  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null);

  if (!trainers || trainers.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A0C10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Coaching & Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              MEET OUR EXPERIENCED TRAINERS
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-sm">
            Dedicated coaches focused on biomechanics, progressive strength, and personalized support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {trainers.map((tr) => (
            <div
              key={tr.id}
              className="group relative rounded-2xl overflow-hidden bg-[#121620] border border-neutral-800/80 shadow-2xl transition-all"
              onClick={() => setActiveOverlayId(activeOverlayId === tr.id ? null : tr.id)}
            >
              {/* Trainer Portrait (4:3 aspect ratio) */}
              <div className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={tr.imageUrl || '/images/trainer_coaching_session_1791802649834.jpg'}
                  alt={tr.name}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/30" />

                {/* Hover / Tap Overlay with Socials and Bio */}
                <div
                  className={`absolute inset-0 bg-black/85 backdrop-blur-sm p-6 flex flex-col justify-between transition-opacity duration-300 ${
                    activeOverlayId === tr.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">
                      {tr.role}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3">{tr.name}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-4">{tr.bio}</p>

                    {tr.qualifications && tr.qualifications.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tr.qualifications.map((q, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold text-neutral-300 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700"
                          >
                            {q}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social & Contact Buttons */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center gap-3">
                    {tr.facebookUrl && (
                      <a
                        href={tr.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-red-600 text-white transition-colors"
                        aria-label="Facebook Profile"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {tr.instagramUrl && (
                      <a
                        href={tr.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-red-600 text-white transition-colors"
                        aria-label="Instagram Profile"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {tr.whatsappUrl && (
                      <a
                        href={tr.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                        aria-label="WhatsApp Coach"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {tr.email && (
                      <a
                        href={`mailto:${tr.email}`}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-red-600 text-white transition-colors"
                        aria-label="Email Coach"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Default Card Bottom Info (Visible before hover) */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-0.5">{tr.name}</h3>
                    <p className="text-xs text-red-400 font-semibold">{tr.role}</p>
                  </div>
                  <div className="text-[11px] text-neutral-500 italic">
                    Tap to view details
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-red-400 transition-colors"
          >
            <span>Learn More About Our Coaching Staff</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}
