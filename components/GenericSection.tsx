'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { PageSectionItem } from '@/lib/data-store';

interface GenericSectionProps {
  sec: PageSectionItem;
  onApply?: (programName?: string) => void;
}

export default function GenericSection({ sec, onApply }: GenericSectionProps) {
  return (
    <section className="relative py-24 bg-ak-ink border-y border-ak-line overflow-hidden">
      {sec.imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={sec.imageUrl}
            alt={sec.heading || 'Gorkhali Gym'}
            fill
            referrerPolicy="no-referrer"
            className="object-cover object-center filter brightness-[0.28] grayscale-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ak-ink via-ak-ink/85 to-ak-ink/50" />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {sec.subheading && (
          <div className="ak-eyebrow justify-center mb-4">
            <span>{sec.subheading}</span>
          </div>
        )}
        {sec.heading && (
          <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-[0.95]">
            {sec.heading}
          </h2>
        )}
        {sec.bodyText && (
          <p className="text-ak-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-6">
            {sec.bodyText}
          </p>
        )}
        {sec.ctaLabel && (
          <div className="pt-8 flex items-center justify-center">
            {sec.ctaUrl ? (
              <Link href={sec.ctaUrl} className="ak-btn ak-btn-primary">
                <span>
                  {sec.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ) : (
              <button type="button" onClick={() => onApply?.(sec.heading)} className="ak-btn ak-btn-primary">
                <span>
                  {sec.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
