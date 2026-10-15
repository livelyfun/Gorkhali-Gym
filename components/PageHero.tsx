'use client';

import React from 'react';
import { usePageSections } from '@/lib/use-page-sections';

export interface PageHeroFallback {
  eyebrow?: string;
  heading: string;
  body?: string;
}

interface PageHeroProps {
  pageSlug: string;
  sectionKey?: string;
  fallback: PageHeroFallback;
  wrapperClassName?: string;
}

export default function PageHero({
  pageSlug,
  sectionKey = 'hero',
  fallback,
  wrapperClassName,
}: PageHeroProps) {
  const sections = usePageSections(pageSlug);
  const section = sections?.find((s) => s.sectionKey === sectionKey) ?? null;

  const eyebrow = section?.subheading || fallback.eyebrow;
  const heading = section?.heading || fallback.heading;
  const body = section?.bodyText || fallback.body;

  return (
    <div className={wrapperClassName ?? 'max-w-3xl'}>
      {eyebrow && <div className="ak-eyebrow mb-4">{eyebrow}</div>}
      <h1 className="font-display text-4xl sm:text-5xl text-white mt-2">{heading}</h1>
      {body && <p className="text-ak-muted text-base sm:text-lg mt-4 leading-relaxed">{body}</p>}
    </div>
  );
}
