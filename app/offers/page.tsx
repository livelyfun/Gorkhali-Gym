'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Clock, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { useCms } from '@/components/cms/CmsProvider';

export default function OffersPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | undefined>();

  const { data } = useCms();
  const offers = (data.offers ?? []).filter(
    (o) => o.isPublished && (!o.validUntil || new Date(o.validUntil) >= new Date())
  );

  const openApply = (title: string) => {
    setSelectedOffer(`Claim Offer: ${title}`);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => openApply('General Offer')} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            pageSlug="offers"
            fallback={{
              eyebrow: 'Special Deals • Gorkhali Gym Itahari',
              heading: 'Current Offers & Promotions',
              body: 'Take advantage of our seasonal discounts, student packages, and new lifter orientation bundles.',
            }}
          />
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {offers.length === 0 ? (
            <div className="text-center py-16 bg-ak-surface-2 border border-ak-line p-8">
              <Tag className="w-12 h-12 text-ak-muted mx-auto mb-3" />
              <h3 className="font-display text-lg text-white">No Active Public Offers Currently</h3>
              <p className="text-sm text-ak-muted mt-1 max-w-sm mx-auto">
                Check back shortly or contact our front desk for current walk-in registration deals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="ak-panel ak-cut-tr overflow-hidden group hover:border-ak-accent/60 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="ak-frame ak-hover-group relative h-56 w-full bg-ak-ink">
                      <Image
                        src={offer.imageUrl || '/images/hero_gorkhali_gym.jpg'}
                        alt={offer.title}
                        fill
                        referrerPolicy="no-referrer"
                        className="ak-img"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ak-surface via-transparent to-transparent" />
                      {offer.badge && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-ak-accent text-white text-[11px] font-extrabold uppercase tracking-wider">
                          {offer.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      {offer.discountInfo && (
                        <span className="inline-block px-2.5 py-1 bg-ak-accent/10 border border-ak-accent/30 text-ak-accent font-bold text-xs uppercase">
                          {offer.discountInfo}
                        </span>
                      )}
                      <h3 className="font-display text-xl text-white group-hover:text-ak-accent transition-colors">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-ak-muted leading-relaxed line-clamp-3">
                        {offer.shortDesc}
                      </p>
                      {offer.validUntil && (
                        <p className="text-[11px] text-neutral-500 flex items-center space-x-1.5 pt-2">
                          <Clock className="w-3.5 h-3.5 text-ak-muted" />
                          <span>Valid until: {offer.validUntil}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-ak-line mt-4 flex items-center justify-between">
                    <Link
                      href={`/offers/${offer.slug}`}
                      className="ak-focus ak-link text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center space-x-1"
                    >
                      <span>Offer Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openApply(offer.title)}
                      className="ak-btn ak-btn-primary !px-4 !py-2 !text-[11px]"
                    >
                      <span>Claim Deal</span>
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
