'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { FaqItem } from '@/lib/data-store';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // Open first question by default
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A0C10]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            Everything you need to know about starting your fitness journey at Gorkhali Gym.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-12">
          {faqs.map((faq) => {
            const isOpen = !!openIds[faq.id];

            return (
              <div
                key={faq.id}
                className="rounded-xl bg-[#121620] border border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-red-400 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-red-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-red-400 transition-colors"
          >
            <span>View All Questions in FAQ Knowledge Base</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}
