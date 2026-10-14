'use client';

import { useEffect, useState } from 'react';
import { store, type PageSectionItem } from './data-store';

export function usePageSections(pageSlug: string): PageSectionItem[] {
  const [sections, setSections] = useState<PageSectionItem[]>(() => store.getSections(pageSlug));

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cms/sections?page=${encodeURIComponent(pageSlug)}`)
      .then((res) => (res.ok ? res.json() : { sections: [] }))
      .then((data) => {
        if (!ignore && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch(() => {
        // Fall back to seeded sections if the CMS is unreachable.
      });
    return () => {
      ignore = true;
    };
  }, [pageSlug]);

  return sections;
}

export function findSection(
  sections: PageSectionItem[],
  sectionKey: string,
): PageSectionItem | undefined {
  return sections.find((s) => s.sectionKey === sectionKey);
}

export function splitParagraphs(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean);
}
