'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Tag, ArrowRight, ChevronLeft, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { store } from '@/lib/data-store';

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const offer = store.getOffers().find((o) => o.slug === slug && o.isPublished);

  if (!offer) {
    notFound();
  }

  const settings = store.getSettings();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/offers"
            className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Offers</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <span className="px-3 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
              {offer.badge || 'Promotional Deal'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {offer.title}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {offer.shortDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900">
                <Image
                  src={offer.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                  alt={offer.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase text-white">Offer Terms & Details</h2>
                <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {offer.fullDesc || offer.shortDesc}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-white">Claim This Offer</h3>
                  {offer.discountInfo && (
                    <div className="my-2 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 font-bold text-sm">
                      {offer.discountInfo}
                    </div>
                  )}
                  {offer.validUntil && (
                    <p className="text-xs text-neutral-400 flex items-center space-x-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Valid until: {offer.validUntil}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>Claim Deal Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20want%20to%20claim%20the%20deal%3A%20${encodeURIComponent(offer.title)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultProgram={`Offer: ${offer.title}`}
      />
    </div>
  );
}
