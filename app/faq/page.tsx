'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { store } from '@/lib/data-store';

export default function FaqPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const faqs = store.getFaqs().filter((f) => f.isPublished);
  const categories = ['all', ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];

  const filteredFaqs =
    activeCategory === 'all' ? faqs : faqs.filter((f) => f.category === activeCategory);

  const settings = store.getSettings();

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            pageSlug="faq"
            fallback={{
              eyebrow: 'Answers • Information • Gorkhali Gym Itahari',
              heading: 'Frequently Asked Questions',
              body: 'Find answers to questions regarding membership, timings, locker usage, beginner orientation, personal training, and gym policies.',
            }}
          />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`ak-focus px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeCategory === cat
                      ? 'bg-ak-accent text-white'
                      : 'bg-ak-surface text-ak-muted hover:text-white border border-ak-line'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <details
                key={faq.id}
                className="group ak-panel ak-cut-bl p-5 border-l-2 border-l-transparent open:border-l-ak-accent transition-colors"
              >
                <summary className="ak-focus flex items-center justify-between cursor-pointer list-none text-white font-display text-base uppercase select-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-ak-muted group-open:rotate-90 group-open:text-ak-accent transition-transform shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-sm text-ak-muted leading-relaxed pt-3 border-t border-ak-line">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="ak-panel ak-cut-tr p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
            <div>
              <h3 className="font-display text-xl text-white">Have a Different Question?</h3>
              <p className="text-xs text-ak-muted mt-1">
                Our front desk and coaches are glad to help anytime.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Gorkhali%20Gym%2C%20I%20have%20a%20question%20about%20the%20gym.`}
                target="_blank"
                rel="noopener noreferrer"
                className="ak-focus inline-flex items-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </a>
              <Link
                href="/contact"
                className="ak-btn ak-btn-outline"
              >
                <span>Contact Page</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
