'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  Announcement,
  BlogPostItem,
  EventItem,
  FaqItem,
  GalleryItemType,
  MembershipPlanItem,
  NavigationItemType,
  OfferItem,
  PageSectionItem,
  ProgramItem,
  ReferralProgramItem,
  ReviewItem,
  SiteSettings,
  SocialVideoItem,
  TrainerItem,
} from '@/lib/data-store';

// Authoritative public CMS data, fetched from the database-backed API instead of
// the client-bundled seed defaults. Layout mounts the provider once per app load;
// every public page and shared component reads from it.
//
// Each collection is fetched independently so a single failing endpoint never
// blocks the rest of the page from rendering.
export interface CmsData {
  settings: SiteSettings | null;
  announcement: Announcement | null;
  navigation: NavigationItemType[] | null;
  programs: ProgramItem[] | null;
  membershipPlans: MembershipPlanItem[] | null;
  trainers: TrainerItem[] | null;
  offers: OfferItem[] | null;
  events: EventItem[] | null;
  gallery: GalleryItemType[] | null;
  reviews: ReviewItem[] | null;
  blog: BlogPostItem[] | null;
  faqs: FaqItem[] | null;
  socialVideos: SocialVideoItem[] | null;
  referral: ReferralProgramItem | null;
}

type SectionKey = `sections:${string}`;
export type CmsErrorKey = keyof CmsData | SectionKey;

export interface CmsContextValue {
  data: CmsData;
  /** True while at least one collection has not settled yet. */
  isLoading: boolean;
  /** True once every collection has settled (loaded or failed). */
  isReady: boolean;
  errors: Partial<Record<CmsErrorKey, boolean>>;
  /** Per-page sections (null while loading, [] when none/errored). */
  getSections: (pageSlug: string) => PageSectionItem[] | null;
  /** Kicks off a lazy fetch for a page's sections. */
  loadSections: (pageSlug: string) => void;
}

const EMPTY_DATA: CmsData = {
  settings: null,
  announcement: null,
  navigation: null,
  programs: null,
  membershipPlans: null,
  trainers: null,
  offers: null,
  events: null,
  gallery: null,
  reviews: null,
  blog: null,
  faqs: null,
  socialVideos: null,
  referral: null,
};

const CmsContext = createContext<CmsContextValue | null>(null);

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return (await res.json()) as T;
}

export function CmsProvider({
  children,
  initialData,
  initialSections,
}: {
  children: React.ReactNode;
  /** Authoritative data rendered on the server (from the hydrated store). */
  initialData?: Partial<CmsData>;
  /** Per-page sections already rendered on the server. */
  initialSections?: Record<string, PageSectionItem[]>;
}) {
  const [data, setData] = useState<CmsData>(() => ({ ...EMPTY_DATA, ...initialData }));
  const [settled, setSettled] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<CmsErrorKey, boolean>>>({});
  const [sections, setSections] = useState<Record<string, PageSectionItem[] | null>>(
    () => ({ ...initialSections }),
  );
  const inFlightSections = useRef<Set<string>>(new Set());
  const presenceRef = useRef<Partial<CmsData>>(initialData ?? {});

  const patch = useCallback(<K extends keyof CmsData>(key: K, value: CmsData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runCollection = useCallback(
    async <K extends keyof CmsData>(
      key: K,
      url: string,
      select: (json: unknown) => CmsData[K],
    ) => {
      try {
        const json = await fetchJson<unknown>(url);
        patch(key, select(json));
      } catch (err) {
        console.error(`[cms] failed to load ${key}:`, err);
        setErrors((prev) => ({ ...prev, [key]: true }));
      } finally {
        setSettled((n) => n + 1);
      }
    },
    [patch],
  );

  useEffect(() => {
    const jobs: Array<[keyof CmsData, string, (json: unknown) => unknown]> = [
      ['settings', '/api/cms/settings', (j) => (j as { settings?: SiteSettings }).settings ?? null],
      ['announcement', '/api/cms/announcement', (j) =>
        (j as { announcement?: Announcement }).announcement ?? null,
      ],
      ['navigation', '/api/cms/navigation', (j) =>
        (j as { navigation?: NavigationItemType[] }).navigation ?? [],
      ],
      ['programs', '/api/cms/programs', (j) => (j as { programs?: ProgramItem[] }).programs ?? []],
      ['membershipPlans', '/api/cms/memberships', (j) =>
        (j as { plans?: MembershipPlanItem[] }).plans ?? [],
      ],
      ['trainers', '/api/cms/trainers', (j) => (j as { trainers?: TrainerItem[] }).trainers ?? []],
      ['offers', '/api/cms/offers', (j) => (j as { offers?: OfferItem[] }).offers ?? []],
      ['events', '/api/cms/events', (j) => (j as { events?: EventItem[] }).events ?? []],
      ['gallery', '/api/cms/gallery', (j) =>
        (j as { gallery?: GalleryItemType[] }).gallery ?? [],
      ],
      ['reviews', '/api/cms/reviews', (j) => (j as { reviews?: ReviewItem[] }).reviews ?? []],
      ['blog', '/api/cms/blog', (j) => (j as { posts?: BlogPostItem[] }).posts ?? []],
      ['faqs', '/api/cms/faqs', (j) => (j as { faqs?: FaqItem[] }).faqs ?? []],
      ['socialVideos', '/api/cms/social-videos', (j) =>
        (j as { videos?: SocialVideoItem[] }).videos ?? [],
      ],
      ['referral', '/api/cms/referrals', (j) =>
        (j as { referral?: ReferralProgramItem }).referral ?? null,
      ],
    ];

    for (const [key, url, select] of jobs) {
      // Server already provided this collection: keep it and skip the refetch.
      if (presenceRef.current[key]) continue;
      void runCollection(key, url, select as (json: unknown) => CmsData[typeof key]);
    }
  }, [runCollection]);

  const loadSections = useCallback(
    (pageSlug: string) => {
      if (inFlightSections.current.has(pageSlug)) return;
      inFlightSections.current.add(pageSlug);
      setSections((prev) => (pageSlug in prev ? prev : { ...prev, [pageSlug]: null }));
      fetchJson<{ sections?: PageSectionItem[] }>(
        `/api/cms/sections?page=${encodeURIComponent(pageSlug)}`,
      )
        .then((json) => {
          setSections((prev) => ({ ...prev, [pageSlug]: json.sections ?? [] }));
        })
        .catch((err) => {
          console.error(`[cms] failed to load sections for ${pageSlug}:`, err);
          setErrors((prev) => ({ ...prev, [`sections:${pageSlug}`]: true }));
          setSections((prev) => ({ ...prev, [pageSlug]: [] }));
        });
    },
    [],
  );

  const getSections = useCallback(
    (pageSlug: string): PageSectionItem[] | null => {
      const value = sections[pageSlug];
      return value === undefined ? null : value;
    },
    [sections],
  );

  const expected = useMemo(() => {
    const provided = initialData ?? {};
    return COLLECTION_KEYS.filter((key) => provided[key] === undefined).length;
  }, [initialData]);

  const value = useMemo<CmsContextValue>(
    () => ({
      data,
      isLoading: settled < expected,
      isReady: settled >= expected,
      errors,
      getSections,
      loadSections,
    }),
    [data, settled, expected, errors, getSections, loadSections],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

const COLLECTION_KEYS: Array<keyof CmsData> = [
  'settings',
  'announcement',
  'navigation',
  'programs',
  'membershipPlans',
  'trainers',
  'offers',
  'events',
  'gallery',
  'reviews',
  'blog',
  'faqs',
  'socialVideos',
  'referral',
];

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return ctx;
}

/**
 * Lazy per-page section data for PageHero and pages that render CMS sections.
 * Returns null while loading so callers can show a skeleton instead of seed copy.
 */
export function useCmsPageSections(pageSlug: string): PageSectionItem[] | null {
  const { getSections, loadSections } = useCms();
  useEffect(() => {
    loadSections(pageSlug);
  }, [pageSlug, loadSections]);
  return getSections(pageSlug);
}
