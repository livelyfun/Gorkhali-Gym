'use client';

import React, { useEffect, useState } from 'react';
import { store, PageSectionItem } from '@/lib/data-store';

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
  const [section, setSection] = useState<PageSectionItem | null>(() => {
    const found = store.getSections(pageSlug, true).find((s) => s.sectionKey === sectionKey);
    return found ?? null;
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/cms/sections?page=${encodeURIComponent(pageSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const found = (data.sections as PageSectionItem[] | undefined)?.find(
          (s) => s.sectionKey === sectionKey
        );
        if (found) setSection(found);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pageSlug, sectionKey]);

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
