'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Clock, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function OffersPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | undefined>();

  const offers = store.getOffers(true, true);

  const openApply = (title: string) => {
    setSelectedOffer(`Claim Offer: ${title}`);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => openApply('General Offer')} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Special Deals &bull; Gorkhali Gym Itahari
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Current Offers & Promotions
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Take advantage of our seasonal discounts, student packages, and new lifter orientation bundles.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {offers.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8">
              <Tag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white uppercase">No Active Public Offers Currently</h3>
              <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
                Check back shortly or contact our front desk for current walk-in registration deals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 w-full bg-neutral-950">
                      <Image
                        src={offer.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                        alt={offer.title}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                      {offer.badge && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider">
                          {offer.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      {offer.discountInfo && (
                        <span className="inline-block px-2.5 py-1 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold text-xs uppercase">
                          {offer.discountInfo}
                        </span>
                      )}
                      <h3 className="text-xl font-bold uppercase text-white group-hover:text-red-500 transition-colors">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                        {offer.shortDesc}
                      </p>
                      {offer.validUntil && (
                        <p className="text-[11px] text-neutral-500 flex items-center space-x-1.5 pt-2">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Valid until: {offer.validUntil}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
                    <Link
                      href={`/offers/${offer.slug}`}
                      className="text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                    >
                      <span>Offer Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openApply(offer.title)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-red-600/20"
                    >
                      Claim Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer onOpenApplyModal={() => openApply('General Offer')} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={selectedOffer}
      />
    </div>
  );
}
