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
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/offers"
            className="ak-focus inline-flex items-center space-x-1.5 text-xs text-ak-muted hover:text-white uppercase font-bold tracking-wider mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Offers</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 bg-ak-accent text-white text-[11px] font-extrabold uppercase tracking-wider">
              {offer.badge || 'Promotional Deal'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-white">
              {offer.title}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {offer.shortDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="ak-frame ak-hover-group relative h-96 w-full border border-ak-line bg-ak-surface">
                <Image
                  src={offer.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                  alt={offer.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="ak-img"
                />
              </div>

              <div className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl text-white">Offer Terms & Details</h2>
                <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {offer.fullDesc || offer.shortDesc}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="ak-panel ak-cut-tr p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="font-display text-xl text-white">Claim This Offer</h3>
                  {offer.discountInfo && (
                    <div className="my-2 p-3 bg-ak-accent/10 border border-ak-accent/30 text-ak-accent font-bold text-sm">
                      {offer.discountInfo}
                    </div>
                  )}
                  {offer.validUntil && (
                    <p className="text-xs text-ak-muted flex items-center space-x-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-ak-muted" />
                      <span>Valid until: {offer.validUntil}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="ak-btn ak-btn-primary w-full"
                  >
                    <span>
                      Claim Deal Now
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Gorkhali%20Gym%2C%20I%20want%20to%20claim%20the%20deal%3A%20${encodeURIComponent(offer.title)}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
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
