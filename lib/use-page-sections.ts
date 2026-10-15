'use client';

import type { PageSectionItem } from './data-store';
import { useCmsPageSections } from '@/components/cms/CmsProvider';

/**
 * Per-page CMS sections from the shared provider (server-injected where
 * available, otherwise fetched once on mount). Returns an empty array while
 * loading so callers render their own fallbacks rather than bundled seed data.
 */
export function usePageSections(pageSlug: string): PageSectionItem[] {
  return useCmsPageSections(pageSlug) ?? [];
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
