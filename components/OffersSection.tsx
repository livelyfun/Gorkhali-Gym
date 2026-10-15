'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import type { OfferItem } from '@/lib/data-store';

interface OffersSectionProps {
  offers: OfferItem[];
  onOpenApplyModal?: (offerTitle?: string) => void;
}

export default function OffersSection({ offers, onOpenApplyModal }: OffersSectionProps) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="py-20 bg-[#0E1118] border-t border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Offers & Promotions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              ACTIVE ENROLLMENT SPECIALS
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-sm">
            Take advantage of special induction and seasonal offers. Limited availability per batch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col rounded-2xl bg-[#121620] border border-neutral-800 overflow-hidden shadow-xl hover:border-red-600/40 transition-all"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                <Image
                  src={offer.imageUrl || '/images/hero_gorkhali_gym_1791802611195.jpg'}
                  alt={offer.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/30" />
                {offer.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shadow">
                    {offer.badge}
                  </span>
                )}
                {offer.discountInfo && (
                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded bg-neutral-900/90 border border-neutral-700 text-red-400 font-bold text-xs">
                    {offer.discountInfo}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{offer.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">{offer.shortDesc}</p>

                  {offer.validUntil && (
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-4">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center gap-3">
                  <Link
                    href={`/offers/${offer.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-800 transition-colors"
                  >
                    Read More
                  </Link>

                  {onOpenApplyModal ? (
                    <button
                      type="button"
                      onClick={() => onOpenApplyModal(offer.title)}
                      className="flex-1 text-center py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-950/40"
                    >
                      Book Now
                    </button>
                  ) : (
                    <Link
                      href={`/apply?offer=${offer.slug}`}
                      className="flex-1 text-center py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-950/40"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
