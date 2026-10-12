'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Answers &bull; Information &bull; Gorkhali Gym Itahari
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Frequently Asked Questions
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              Find answers to questions regarding membership, timings, locker usage, beginner orientation, personal training, and gym policies.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
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
                className="group p-6 rounded-2xl bg-neutral-900 border border-neutral-800 transition-colors open:border-neutral-700 open:bg-neutral-900/90"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-white font-bold text-base sm:text-lg select-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-neutral-500 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-sm text-neutral-300 leading-relaxed pt-3 border-t border-neutral-800">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
            <div>
              <h3 className="text-xl font-bold uppercase text-white">Have a Different Question?</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Our front desk and coaches are glad to help anytime.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Gorkhali%20Gym%2C%20I%20have%20a%20question%20about%20the%20gym.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </a>
              <Link
                href="/contact"
                className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Contact Page
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
