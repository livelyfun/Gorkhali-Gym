'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  Layers,
  Compass,
  Bell,
  Dumbbell,
  Sparkles,
  CreditCard,
  Tag,
  Calendar,
  Users,
  Image as ImageIcon,
  Star,
  BookOpen,
  HelpCircle,
  Inbox,
  FolderOpen,
  Shield,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Save,
  Check,
  CheckCircle,
  Video,
  X,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Copy,
  Upload,
  Search,
  Link2,
} from 'lucide-react';
import {
  SiteSettings,
  Announcement,
  PageSectionItem,
  NavigationItemType,
  ProgramItem,
  MembershipPlanItem,
  ReferralProgramItem,
  OfferItem,
  EventItem,
  TrainerItem,
  GalleryItem,
  ReviewItem,
  BlogPostItem,
  FaqItem,
  InquiryItem,
  MediaAssetItem,
  SocialVideoItem,
} from '@/lib/data-store';
import ImagePickerField from '@/components/cms/ImagePickerField';
import AkButton from '@/components/cms/AkButton';
import AkCard from '@/components/cms/AkCard';
import AkField from '@/components/cms/AkField';
import AkInput from '@/components/cms/AkInput';
import AkTextarea from '@/components/cms/AkTextarea';
import AkSelect from '@/components/cms/AkSelect';
import AkToggle from '@/components/cms/AkToggle';
import AkPageHeader from '@/components/cms/AkPageHeader';
import AkTabNav from '@/components/cms/AkTabNav';
import AkEmptyState from '@/components/cms/AkEmptyState';
import AkStatCard from '@/components/cms/AkStatCard';
import Toast from '@/components/cms/Toast';
import ConfirmDialog from '@/components/cms/ConfirmDialog';
import SectionHeader from '@/components/cms/SectionHeader';
import Skeleton from '@/components/cms/Skeleton';
import { validateSocialVideo, PLATFORM_LABELS } from '@/lib/social-video';


type TabType =
  | 'dashboard'
  | 'settings'
  | 'sections'
  | 'navigation'
  | 'announcement'
  | 'programs'
  | 'services'
  | 'memberships'
  | 'offers'
  | 'events'
  | 'trainers'
  | 'gallery'
  | 'videos'
  | 'reviews'
  | 'blog'
  | 'faqs'
  | 'inquiries'
  | 'media'
  | 'security';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CMS State
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sections, setSections] = useState<PageSectionItem[]>([]);
  const [sectionPageFilter, setSectionPageFilter] = useState('home');
  const [navigation, setNavigation] = useState<NavigationItemType[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [services, setServices] = useState<ProgramItem[]>([]);
  const [memberships, setMemberships] = useState<MembershipPlanItem[]>([]);
  const [referral, setReferral] = useState<ReferralProgramItem | null>(null);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [trainers, setTrainers] = useState<TrainerItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<SocialVideoItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [blog, setBlog] = useState<BlogPostItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);

  // UI / Feedback State
  const [loadingData, setLoadingData] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Confirm dialog (replaces native window.confirm)
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const confirmResolveRef = useRef<((value: boolean) => void) | null>(null);
  const confirmAction = (message: string) =>
    new Promise<boolean>((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmMessage(message);
    });
  const resolveConfirm = (value: boolean) => {
    setConfirmMessage(null);
    confirmResolveRef.current?.(value);
    confirmResolveRef.current = null;
  };

  // Track locally-created drafts so they can be auto-persisted once valid
  const newGalleryDraftIds = useRef<Set<string>>(new Set());
  const newVideoDraftIds = useRef<Set<string>>(new Set());

  // Inquiry filter and search
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');

  // Review moderation filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'published'>('all');

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwFeedback, setPwFeedback] = useState<string | null>(null);

  // New admin creation state
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'superadmin' | 'admin'>('admin');
  const [createAdminFeedback, setCreateAdminFeedback] = useState<string | null>(null);

  // Media Library state (support both external URL and file upload)
  const [mediaSourceMode, setMediaSourceMode] = useState<'url' | 'file'>('url');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [externalFilename, setExternalFilename] = useState('');
  const [externalAlt, setExternalAlt] = useState('');
  const [externalCaption, setExternalCaption] = useState('');
  const [externalUrlLoading, setExternalUrlLoading] = useState(false);
  const [externalUrlError, setExternalUrlError] = useState<string | null>(null);
  const [externalImgStatus, setExternalImgStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');



  // Silent session check on mount (non-blocking: login form remains immediately visible)
  useEffect(() => {
    let ignore = false;
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.authenticated && data?.user) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          fetchAllCmsData(data.user);
        }
      })
      .catch(() => {
        // Silent: keep login form displayed
      });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        fetchAllCmsData(data.user);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Failed to connect to authentication server');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  async function fetchAllCmsData(currentUser?: AdminUser | null) {
    const user = currentUser || adminUser;
    setLoadingData(true);
    try {
      const [
        dashRes,
        sRes,
        secRes,
        navRes,
        aRes,
        pRes,
        srvRes,
        mRes,
        refRes,
        oRes,
        eRes,
        tRes,
        gRes,
        rRes,
        bRes,
        fRes,
        iRes,
        medRes,
        svRes,
      ] = await Promise.all([
        fetch('/api/cms/dashboard'),
        fetch('/api/cms/settings'),
        fetch('/api/cms/sections?all=true'),
        fetch('/api/cms/navigation?all=true'),
        fetch('/api/cms/announcement?all=true'),
        fetch('/api/cms/programs?all=true&category=training'),
        fetch('/api/cms/programs?all=true&category=service'),
        fetch('/api/cms/memberships?all=true'),
        fetch('/api/cms/referrals'),
        fetch('/api/cms/offers?all=true'),
        fetch('/api/cms/events?all=true'),
        fetch('/api/cms/trainers?all=true'),
        fetch('/api/cms/gallery?all=true'),
        fetch('/api/cms/reviews?all=true'),
        fetch('/api/cms/blog?all=true'),
        fetch('/api/cms/faqs?all=true'),
        fetch('/api/inquiries'),
        fetch('/api/cms/media'),
        fetch('/api/cms/social-videos?all=true'),
      ]);

      const [
        dashData,
        sData,
        secData,
        navData,
        aData,
        pData,
        srvData,
        mData,
        refData,
        oData,
        eData,
        tData,
        gData,
        rData,
        bData,
        fData,
        iData,
        medData,
        svData,
      ] = await Promise.all([
        dashRes.json().catch(() => null),
        sRes.json().catch(() => ({})),
        secRes.json().catch(() => ({ sections: [] })),
        navRes.json().catch(() => ({ navigation: [] })),
        aRes.json().catch(() => ({})),
        pRes.json().catch(() => ({ programs: [] })),
        srvRes.json().catch(() => ({ programs: [] })),
        mRes.json().catch(() => ({ plans: [] })),
        refRes.json().catch(() => ({ referral: null })),
        oRes.json().catch(() => ({ offers: [] })),
        eRes.json().catch(() => ({ events: [] })),
        tRes.json().catch(() => ({ trainers: [] })),
        gRes.json().catch(() => ({ gallery: [] })),
        rRes.json().catch(() => ({ reviews: [] })),
        bRes.json().catch(() => ({ blog: [] })),
        fRes.json().catch(() => ({ faqs: [] })),
        iRes.json().catch(() => ({ inquiries: [] })),
        medRes.json().catch(() => ({ assets: [] })),
        svRes.json().catch(() => ({ videos: [] })),
      ]);

      const responseChecks: Array<[string, Response]> = [
        ['dashboard', dashRes],
        ['settings', sRes],
        ['sections', secRes],
        ['navigation', navRes],
        ['announcement', aRes],
        ['programs (training)', pRes],
        ['programs (service)', srvRes],
        ['memberships', mRes],
        ['referrals', refRes],
        ['offers', oRes],
        ['events', eRes],
        ['trainers', tRes],
        ['gallery', gRes],
        ['reviews', rRes],
        ['blog', bRes],
        ['faqs', fRes],
        ['inquiries', iRes],
        ['media', medRes],
        ['social videos', svRes],
      ];
      const failed = responseChecks
        .filter(([, res]) => !res.ok)
        .map(([name, res]) => (res.status === 401 ? `${name} (not authenticated)` : `${name} (${res.status})`));
      if (failed.length > 0) {
        console.error('[CMS] Some data failed to load:', failed.join(', '));
        triggerFeedback(
          `Some content failed to load: ${failed.slice(0, 3).join(', ')}${
            failed.length > 3 ? ` and ${failed.length - 3} more` : ''
          }`
        );
      }

      if (dashData) setDashboardStats(dashData);
      if (sData.settings) setSettings(sData.settings);
      if (secData.sections) setSections(secData.sections);
      if (navData.navigation) setNavigation(navData.navigation);
      if (aData.announcement) setAnnouncement(aData.announcement);
      if (pData.programs) setPrograms(pData.programs);
      if (srvData.programs) setServices(srvData.programs);
      if (mData.plans) setMemberships(mData.plans);
      if (refData.referral) setReferral(refData.referral);
      if (oData.offers) setOffers(oData.offers);
      if (eData.events) setEvents(eData.events);
      if (tData.trainers) setTrainers(tData.trainers);
      if (gData.gallery) setGallery(gData.gallery);
      if (rData.reviews) setReviews(rData.reviews);
      if (bData.blog) setBlog(bData.blog);
      if (fData.faqs) setFaqs(fData.faqs);
      if (iData.inquiries) setInquiries(iData.inquiries);
      if (medData.assets) setMediaAssets(medData.assets);
      if (svData.videos) setVideos(svData.videos);

      // If user is superadmin, fetch admins list
      if (user?.role === 'superadmin') {
        const adminsRes = await fetch('/api/auth/admins');
        const adminsData = await adminsRes.json().catch(() => ({ admins: [] }));
        if (adminsData.admins) setAdminUsersList(adminsData.admins);
      }
    } catch {
      // Silently finish
    } finally {
      setLoadingData(false);
    }
  };

  const triggerFeedback = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // --- SAVE HANDLERS ---
  const saveSettings = async () => {
    if (!settings) return;
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        triggerFeedback('Business settings saved & public pages synchronized!');
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save settings'}`);
      }
    } catch {
      triggerFeedback('Network error while saving settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const saveAnnouncement = async () => {
    if (!announcement) return;
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncement(data.announcement);
        triggerFeedback('Announcement banner updated & published!');
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to update announcement'}`);
      }
    } catch {
      triggerFeedback('Network error while saving announcement');
    } finally {
      setSaveLoading(false);
    }
  };

  const saveSectionItem = async (sec: PageSectionItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sec),
      });
      const data = await res.json();
      if (data.success) {
        setSections((prev) => {
          const idx = prev.findIndex((s) => s.id === data.section.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.section;
            return next;
          }
          return [...prev, data.section];
        });
        triggerFeedback(`Section "${sec.heading}" saved!`);
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save section'}`);
      }
    } catch {
      triggerFeedback('Network error while saving section');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteSectionItem = async (id: string) => {
    if (!(await confirmAction('Are you sure you want to delete this page section?'))) return;
    try {
      await fetch(`/api/cms/sections?id=${id}`, { method: 'DELETE' });
      setSections((prev) => prev.filter((s) => s.id !== id));
      triggerFeedback('Section deleted');
    } catch {
      triggerFeedback('Failed to delete section');
    }
  };

  const saveProgramItem = async (prog: ProgramItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prog),
      });
      const data = await res.json();
      if (data.success) {
        if (prog.category === 'service') {
          setServices((prev) => {
            const idx = prev.findIndex((p) => p.id === data.program.id);
            if (idx !== -1) {
              const next = [...prev];
              next[idx] = data.program;
              return next;
            }
            return [...prev, data.program];
          });
        } else {
          setPrograms((prev) => {
            const idx = prev.findIndex((p) => p.id === data.program.id);
            if (idx !== -1) {
              const next = [...prev];
              next[idx] = data.program;
              return next;
            }
            return [...prev, data.program];
          });
        }
        triggerFeedback(`Saved ${prog.title}!`);
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save program'}`);
      }
    } catch {
      triggerFeedback('Network error while saving program');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteProgramItem = async (id: string, category: 'training' | 'service') => {
    if (!(await confirmAction('Are you sure you want to delete this program?'))) return;
    try {
      await fetch(`/api/cms/programs?id=${id}`, { method: 'DELETE' });
      if (category === 'service') {
        setServices((prev) => prev.filter((p) => p.id !== id));
      } else {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      }
      triggerFeedback('Program deleted');
    } catch {
      triggerFeedback('Failed to delete program');
    }
  };

  const saveMembershipItem = async (plan: MembershipPlanItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      const data = await res.json();
      if (data.success) {
        setMemberships((prev) => {
          const idx = prev.findIndex((p) => p.id === data.plan.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.plan;
            return next;
          }
          return [...prev, data.plan];
        });
        triggerFeedback(`Saved plan "${plan.name}"!`);
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save membership plan'}`);
      }
    } catch {
      triggerFeedback('Network error while saving membership plan');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteMembershipItem = async (id: string) => {
    if (!(await confirmAction('Are you sure you want to delete this membership plan?'))) return;
    try {
      await fetch(`/api/cms/memberships?id=${id}`, { method: 'DELETE' });
      setMemberships((prev) => prev.filter((p) => p.id !== id));
      triggerFeedback('Membership plan deleted');
    } catch {
      triggerFeedback('Failed to delete membership plan');
    }
  };

  const saveReferralItem = async () => {
    if (!referral) return;
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(referral),
      });
      const data = await res.json();
      if (data.success) {
        setReferral(data.referral);
        triggerFeedback('Referral program benefits & rules saved!');
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save referral program'}`);
      }
    } catch {
      triggerFeedback('Network error while saving referral program');
    } finally {
      setSaveLoading(false);
    }
  };

  const saveOfferItem = async (offer: OfferItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      const data = await res.json();
      if (data.success) {
        setOffers((prev) => {
          const idx = prev.findIndex((o) => o.id === data.offer.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.offer;
            return next;
          }
          return [...prev, data.offer];
        });
        triggerFeedback(`Saved offer "${offer.title}"!`);
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save offer'}`);
      }
    } catch {
      triggerFeedback('Network error while saving offer');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteOfferItem = async (id: string) => {
    if (!(await confirmAction('Delete this promotional offer?'))) return;
    try {
      await fetch(`/api/cms/offers?id=${id}`, { method: 'DELETE' });
      setOffers((prev) => prev.filter((o) => o.id !== id));
      triggerFeedback('Offer deleted');
    } catch {
      triggerFeedback('Failed to delete offer');
    }
  };

  const saveEventItem = async (evt: EventItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evt),
      });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) => {
          const idx = prev.findIndex((e) => e.id === data.event.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.event;
            return next;
          }
          return [...prev, data.event];
        });
        triggerFeedback(`Saved event "${evt.title}"!`);
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save event'}`);
      }
    } catch {
      triggerFeedback('Network error while saving event');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteEventItem = async (id: string) => {
    if (!(await confirmAction('Delete this event?'))) return;
    try {
      await fetch(`/api/cms/events?id=${id}`, { method: 'DELETE' });
      setEvents((prev) => prev.filter((e) => e.id !== id));
      triggerFeedback('Event deleted');
    } catch {
      triggerFeedback('Failed to delete event');
    }
  };

  const saveTrainerItem = async (tr: TrainerItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tr),
      });
      const data = await res.json();
      if (data.success) {
        setTrainers((prev) => {
          const idx = prev.findIndex((t) => t.id === data.trainer.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.trainer;
            return next;
          }
          return [...prev, data.trainer];
        });
        triggerFeedback(`Saved coach "${tr.name}"!`);
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save trainer'}`);
      }
    } catch {
      triggerFeedback('Network error while saving trainer');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteTrainerItem = async (id: string) => {
    if (!(await confirmAction('Delete this trainer profile?'))) return;
    try {
      await fetch(`/api/cms/trainers?id=${id}`, { method: 'DELETE' });
      setTrainers((prev) => prev.filter((t) => t.id !== id));
      triggerFeedback('Trainer profile deleted');
    } catch {
      triggerFeedback('Failed to delete trainer');
    }
  };

  const saveReviewModeration = async (rev: ReviewItem, isPublished: boolean) => {
    const updated = { ...rev, isPublished };
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => {
          const idx = prev.findIndex((r) => r.id === rev.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.review;
            return next;
          }
          return prev;
        });
        triggerFeedback(isPublished ? 'Review approved and published!' : 'Review unpublished / rejected.');
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to update review'}`);
      }
    } catch {
      triggerFeedback('Network error while updating review');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteReviewItem = async (id: string) => {
    if (!(await confirmAction('Delete this review?'))) return;
    try {
      await fetch(`/api/cms/reviews?id=${id}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      triggerFeedback('Review deleted');
    } catch {
      triggerFeedback('Failed to delete review');
    }
  };

  const saveBlogPostItem = async (post: BlogPostItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const data = await res.json();
      if (data.success) {
        setBlog((prev) => {
          const idx = prev.findIndex((b) => b.id === data.post.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.post;
            return next;
          }
          return [...prev, data.post];
        });
        triggerFeedback(`Blog post "${post.title}" saved!`);
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save blog post'}`);
      }
    } catch {
      triggerFeedback('Network error while saving blog post');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteBlogPostItem = async (id: string) => {
    if (!(await confirmAction('Delete this blog post?'))) return;
    try {
      await fetch(`/api/cms/blog?id=${id}`, { method: 'DELETE' });
      setBlog((prev) => prev.filter((b) => b.id !== id));
      triggerFeedback('Blog post deleted');
    } catch {
      triggerFeedback('Failed to delete post');
    }
  };

  const saveFaqItem = async (faq: FaqItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => {
          const idx = prev.findIndex((f) => f.id === data.faq.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.faq;
            return next;
          }
          return [...prev, data.faq];
        });
        triggerFeedback('FAQ entry saved!');
      } else {
        triggerFeedback(`Error: ${data.error || 'Failed to save FAQ'}`);
      }
    } catch {
      triggerFeedback('Network error while saving FAQ');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteFaqItem = async (id: string) => {
    if (!(await confirmAction('Delete this FAQ entry?'))) return;
    try {
      await fetch(`/api/cms/faqs?id=${id}`, { method: 'DELETE' });
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      triggerFeedback('FAQ deleted');
    } catch {
      triggerFeedback('Failed to delete FAQ');
    }
  };

  const saveNavigationItem = async (item: NavigationItemType) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.success) {
        setNavigation((prev) => {
          const idx = prev.findIndex((n) => n.id === data.item.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.item;
            return next;
          }
          return [...prev, data.item];
        });
        triggerFeedback('Navigation item saved!');
      } else if (data.error) {
        triggerFeedback(`Error: ${data.error}`);
      }
    } catch {
      triggerFeedback('Failed to save navigation item');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteNavigationItem = async (id: string) => {
    if (!(await confirmAction('Delete this navigation link?'))) return;
    try {
      await fetch(`/api/cms/navigation?id=${id}`, { method: 'DELETE' });
      setNavigation((prev) => prev.filter((n) => n.id !== id));
      triggerFeedback('Navigation link deleted');
    } catch {
      triggerFeedback('Failed to delete navigation item');
    }
  };

  const saveGalleryItem = async (item: GalleryItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.success) {
        setGallery((prev) => {
          const idx = prev.findIndex((g) => g.id === data.item.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.item;
            return next;
          }
          return [...prev, data.item];
        });
        newGalleryDraftIds.current.delete(data.item.id);
        triggerFeedback('Gallery item saved!');
      } else if (data.error) {
        triggerFeedback(`Error: ${data.error}`);
      }
    } catch {
      triggerFeedback('Failed to save gallery item');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!(await confirmAction('Delete this gallery photo?'))) return;
    try {
      await fetch(`/api/cms/gallery?id=${id}`, { method: 'DELETE' });
      setGallery((prev) => prev.filter((g) => g.id !== id));
      triggerFeedback('Gallery photo deleted');
    } catch {
      triggerFeedback('Failed to delete gallery item');
    }
  };

  const saveSocialVideo = async (item: SocialVideoItem) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/cms/social-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) => {
          const idx = prev.findIndex((v) => v.id === data.item.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = data.item;
            return next;
          }
          return [...prev, data.item];
        });
        newVideoDraftIds.current.delete(data.item.id);
        triggerFeedback('Video saved!');
      } else if (data.error) {
        triggerFeedback(`Error: ${data.error}`);
      }
    } catch {
      triggerFeedback('Failed to save video');
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteSocialVideo = async (id: string) => {
    if (!(await confirmAction('Delete this video?'))) return;
    try {
      await fetch(`/api/cms/social-videos?id=${id}`, { method: 'DELETE' });
      setVideos((prev) => prev.filter((v) => v.id !== id));
      triggerFeedback('Video deleted');
    } catch {
      triggerFeedback('Failed to delete video');
    }
  };

  const toggleGalleryPublish = (g: GalleryItem) => {
    const updated = { ...g, isPublished: !g.isPublished };
    setGallery((prev) => prev.map((item) => (item.id === g.id ? updated : item)));
    // Persist immediately once the record is valid; otherwise keep local until Save
    if (updated.title && updated.imageUrl) saveGalleryItem(updated);
  };

  const toggleVideoPublish = (v: SocialVideoItem) => {
    const updated = { ...v, isPublished: !v.isPublished };
    setVideos((prev) => prev.map((item) => (item.id === v.id ? updated : item)));
    if (updated.title && updated.url && validateSocialVideo(updated.url).ok) {
      saveSocialVideo(updated);
    }
  };

  const moveVideoOrder = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= videos.length) return;
    const current = videos[idx];
    const other = videos[target];
    saveSocialVideo({ ...current, displayOrder: other.displayOrder });
    saveSocialVideo({ ...other, displayOrder: current.displayOrder });
  };

  const updateInquiryStatus = async (id: string, status: InquiryItem['status'], adminNotes?: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status, adminNotes: adminNotes ?? i.adminNotes } : i))
        );
        triggerFeedback(`Inquiry status updated to ${status}`);
      }
    } catch {
      triggerFeedback('Failed to update inquiry status');
    }
  };

  const deleteInquiryItem = async (id: string) => {
    if (!(await confirmAction('Are you sure you want to delete this inquiry record?'))) return;
    try {
      await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      triggerFeedback('Inquiry record deleted');
    } catch {
      triggerFeedback('Failed to delete inquiry');
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploadLoading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('altText', uploadAlt);
    formData.append('caption', uploadCaption);

    try {
      let res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      let data = await res.json();
      // If Vercel Blob is not configured, fallback gracefully to /api/upload-local
      if (!res.ok && (data.error?.includes('BLOB_READ_WRITE_TOKEN') || res.status === 503)) {
        res = await fetch('/api/upload-local', {
          method: 'POST',
          body: formData,
        });
        data = await res.json();
      }

      if (data.success && data.asset) {
        setMediaAssets((prev) => [data.asset, ...prev]);
        setUploadFile(null);
        setUploadAlt('');
        setUploadCaption('');
        triggerFeedback('Media asset successfully stored & added to library!');
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch {
      setUploadError('Network error during upload');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSaveExternalUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = externalUrl.trim();
    if (!cleanUrl) {
      setExternalUrlError('Please provide an image URL');
      return;
    }

    if (!/^https?:\/\//i.test(cleanUrl) && !/^\//.test(cleanUrl) && !/^data:image\//.test(cleanUrl)) {
      setExternalUrlError('Please enter a valid URL starting with https://, http://, or /path');
      return;
    }

    setExternalUrlLoading(true);
    setExternalUrlError(null);

    let defaultName = 'external_image';
    try {
      const u = new URL(cleanUrl);
      const seg = u.pathname.split('/').filter(Boolean).pop();
      if (seg) defaultName = decodeURIComponent(seg).slice(0, 40);
    } catch {
      const seg = cleanUrl.split('/').filter(Boolean).pop();
      if (seg) defaultName = seg.slice(0, 40);
    }

    try {
      const res = await fetch('/api/cms/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: cleanUrl,
          filename: (externalFilename || defaultName).trim(),
          altText: externalAlt.trim() || null,
          caption: externalCaption.trim() || null,
          pathname: 'external',
          size: 0,
          mimeType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (res.ok && data.asset) {
        setMediaAssets((prev) => [data.asset, ...prev]);
        setExternalUrl('');
        setExternalFilename('');
        setExternalAlt('');
        setExternalCaption('');
        setExternalImgStatus('idle');
        triggerFeedback('External image successfully added to Media Library!');
      } else {
        setExternalUrlError(data.error || 'Failed to save media asset');
      }
    } catch {
      setExternalUrlError('Network error while saving external media');
    } finally {
      setExternalUrlLoading(false);
    }
  };

  const deleteMediaItem = async (id: string) => {
    if (!(await confirmAction('Delete this media asset from library?'))) return;
    try {
      const res = await fetch(`/api/cms/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMediaAssets((prev) => prev.filter((m) => m.id !== id));
        triggerFeedback('Media asset removed');
      } else {
        triggerFeedback(data.error || 'Cannot delete this asset');
      }
    } catch {
      triggerFeedback('Failed to delete media asset');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwFeedback(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setPwFeedback('Password updated successfully!');
        setCurrentPw('');
        setNewPw('');
      } else {
        setPwFeedback(`Error: ${data.error || data.message || 'Failed to change password'}`);
      }
    } catch {
      setPwFeedback('Network error while changing password');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAdminFeedback(null);
    try {
      const res = await fetch('/api/auth/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newAdminUsername,
          name: newAdminName,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setAdminUsersList((prev) => [...prev, data.user]);
        setCreateAdminFeedback('New administrator created successfully!');
        setNewAdminUsername('');
        setNewAdminName('');
        setNewAdminPassword('');
      } else {
        setCreateAdminFeedback(`Error: ${data.error || data.message || 'Failed to create administrator'}`);
      }
    } catch {
      setCreateAdminFeedback('Network error while creating administrator');
    }
  };
  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ak-ink flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Gorkhali Fitness"
            className="h-20 w-auto mx-auto mb-4 drop-shadow-xl"
          />
          <h2 className="text-2xl font-display text-white uppercase tracking-tight">
            CMS Portal
          </h2>
          <p className="mt-2 text-xs text-ak-muted uppercase tracking-widest font-mono">
            Authorized Personnel · Dharan Road, Itahari
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-ak-surface/90 border border-ak-line py-8 px-6 shadow-2xl rounded-none sm:px-10 backdrop-blur-sm">

            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-3 rounded-none bg-ak-accent/10 border border-ak-accent/40 text-ak-accent text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-ak-accent" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 bg-ak-accent hover:bg-ak-accent-light disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-lg shadow-ak-accent/30 transition-all flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className="text-xs text-ak-muted hover:text-white transition-colors"
                >
                  &larr; Return to Public Website
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }



  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter !== 'all' && inq.status !== inquiryStatusFilter) return false;
    if (inquirySearch.trim()) {
      const q = inquirySearch.toLowerCase();
      const matchName = inq.fullName.toLowerCase().includes(q);
      const matchPhone = inq.phone.toLowerCase().includes(q);
      const matchRef = inq.referenceCode.toLowerCase().includes(q);
      return matchName || matchPhone || matchRef;
    }
    return true;
  });

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    if (reviewFilter === 'pending') return !rev.isPublished;
    if (reviewFilter === 'published') return rev.isPublished;
    return true;
  });

  // Tab config for AkTabNav
  const tabConfig: Array<{
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeVariant?: 'accent' | 'amber';
    group?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'inquiries', label: 'Inquiries & Leads', icon: <Inbox className="w-4 h-4" />, badge: inquiries.filter((i) => i.status === 'new').length, badgeVariant: 'accent' as const },
    { id: 'settings', label: 'Business & Branding', icon: <Settings className="w-4 h-4" />, group: 'Settings' },
    { id: 'sections', label: 'Page & Sections', icon: <Layers className="w-4 h-4" /> },
    { id: 'navigation', label: 'Navigation & Footer', icon: <Compass className="w-4 h-4" /> },
    { id: 'announcement', label: 'Announcement Bar', icon: <Bell className="w-4 h-4" /> },
    { id: 'programs', label: 'Training Programs', icon: <Dumbbell className="w-4 h-4" />, group: 'Core Offerings' },
    { id: 'services', label: 'General Services', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'memberships', label: 'Memberships & Referral', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'offers', label: 'Offers & Promos', icon: <Tag className="w-4 h-4" /> },
    { id: 'events', label: 'Events & Clinics', icon: <Calendar className="w-4 h-4" /> },
    { id: 'trainers', label: 'Trainers & Coaches', icon: <Users className="w-4 h-4" />, group: 'Community & Media' },
    { id: 'reviews', label: 'Reviews & Moderation', icon: <Star className="w-4 h-4" />, badge: reviews.filter((r) => !r.isPublished).length, badgeVariant: 'amber' as const },
    { id: 'gallery', label: 'Facility Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'videos', label: 'Social Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'media', label: 'Media Library', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'blog', label: 'Articles & Blog', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'faqs', label: 'FAQ Knowledge Base', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Admins', icon: <Shield className="w-4 h-4" />, group: 'Security' },
  ];

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 bg-ak-ink border-b border-ak-line px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Gorkhali Fitness"
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="text-base font-display tracking-tight text-white flex items-center gap-2">
              <span>CMS Portal</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-ak-accent/10 border border-ak-accent/40 text-ak-accent font-mono uppercase">
                {adminUser?.role || 'Admin'}
              </span>
            </h1>
            <p className="text-[10px] text-ak-muted font-medium">Itahari &bull; Koshi Province</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Toast message={saveStatus} onClose={() => setSaveStatus(null)} />

          <AkButton
            variant="secondary"
            size="sm"
            onClick={() => fetchAllCmsData()}
            disabled={loadingData}
            title="Refresh all CMS data"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-ak-accent' : ''}`} />}
          >
            Refresh
          </AkButton>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-ak-surface border border-ak-line text-xs font-semibold text-white hover:text-white hover:bg-ak-surface-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          <AkButton variant="outline" size="sm" onClick={handleLogout} icon={<LogOut className="w-3.5 h-3.5" />}>
            Logout
          </AkButton>
        </div>
      </header>

      {loadingData && (
        <div className="h-0.5 w-full bg-ak-accent/20 overflow-hidden">
          <div className="h-full w-1/3 bg-ak-accent animate-pulse" />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-ak-ink border-r border-ak-line flex flex-col shrink-0 overflow-y-auto">
          <AkTabNav
            items={tabConfig}
            active={activeTab}
            onChange={(id) => setActiveTab(id as TabType)}
            mobileOpen={sidebarOpen}
            onMobileToggle={() => setSidebarOpen((o) => !o)}
          />
        </aside>

        {/* Main Content Workspace */}
        <main className="relative flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {loadingData && !dashboardStats && (
            <div className="absolute inset-0 z-30 bg-ak-ink/85 p-6 sm:p-8">
              <div className="space-y-4 max-w-5xl">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28" />
                  ))}
                </div>
                <Skeleton className="h-64" />
              </div>
            </div>
          )}
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    CMS Overview &amp; Real Metrics
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Live counts directly computed from stored database records.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-ak-surface border border-ak-line text-white">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dashboardStats?.systemStatus?.databaseConnected ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>
                      {dashboardStats?.systemStatus?.databaseConnected
                        ? 'PostgreSQL Connected'
                        : 'Dev Fixture Mode'}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-ak-surface border border-ak-line text-white">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dashboardStats?.systemStatus?.vercelBlobConfigured ? 'bg-emerald-500' : 'bg-ak-muted'
                      }`}
                    />
                    <span>
                      {dashboardStats?.systemStatus?.vercelBlobConfigured
                        ? 'Vercel Blob Active'
                        : 'Blob Pending Config'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Real Metric Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="bg-ak-surface/80 border border-ak-line p-4 rounded-none hover:border-ak-accent/50 cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ak-muted">
                    New Inquiries
                  </span>
                  <div className="text-3xl font-black text-ak-accent mt-1">
                    {inquiries.filter((i) => i.status === 'new').length}
                  </div>
                  <span className="text-[11px] text-ak-muted mt-1 block">
                    {inquiries.length} total applications
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('reviews')}
                  className="bg-ak-surface/80 border border-ak-line p-4 rounded-none hover:border-amber-600/50 cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ak-muted">
                    Pending Reviews
                  </span>
                  <div className="text-3xl font-black text-amber-500 mt-1">
                    {reviews.filter((r) => !r.isPublished).length}
                  </div>
                  <span className="text-[11px] text-ak-muted mt-1 block">
                    {reviews.filter((r) => r.isPublished).length} published live
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('offers')}
                  className="bg-ak-surface/80 border border-ak-line p-4 rounded-none hover:border-ak-line cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ak-muted">
                    Active Offers
                  </span>
                  <div className="text-3xl font-black text-white mt-1">
                    {offers.filter((o) => o.isPublished).length}
                  </div>
                  <span className="text-[11px] text-ak-muted mt-1 block">
                    {offers.length} configured promos
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('programs')}
                  className="bg-ak-surface/80 border border-ak-line p-4 rounded-none hover:border-ak-line cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ak-muted">
                    Training &amp; Services
                  </span>
                  <div className="text-3xl font-black text-white mt-1">
                    {programs.filter((p) => p.isPublished).length +
                      services.filter((s) => s.isPublished).length}
                  </div>
                  <span className="text-[11px] text-ak-muted mt-1 block">
                    {programs.length} training &bull; {services.length} services
                  </span>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  onClick={() => setActiveTab('trainers')}
                  className="bg-ak-surface/40 border border-ak-line/80 p-3 rounded-none cursor-pointer hover:bg-ak-surface"
                >
                  <span className="text-[10px] text-ak-muted uppercase font-bold">Published Coaches</span>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {trainers.filter((t) => t.isPublished).length}
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('blog')}
                  className="bg-ak-surface/40 border border-ak-line/80 p-3 rounded-none cursor-pointer hover:bg-ak-surface"
                >
                  <span className="text-[10px] text-ak-muted uppercase font-bold">Blog Articles</span>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {blog.filter((b) => b.isPublished).length}{' '}
                    <span className="text-xs text-ak-muted font-normal">
                      ({blog.filter((b) => !b.isPublished).length} drafts)
                    </span>
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('gallery')}
                  className="bg-ak-surface/40 border border-ak-line/80 p-3 rounded-none cursor-pointer hover:bg-ak-surface"
                >
                  <span className="text-[10px] text-ak-muted uppercase font-bold">Gallery Photos</span>
                  <p className="text-xl font-bold text-white mt-0.5">{gallery.length}</p>
                </div>
                <div
                  onClick={() => setActiveTab('media')}
                  className="bg-ak-surface/40 border border-ak-line/80 p-3 rounded-none cursor-pointer hover:bg-ak-surface"
                >
                  <span className="text-[10px] text-ak-muted uppercase font-bold">Media Library</span>
                  <p className="text-xl font-bold text-white mt-0.5">{mediaAssets.length} assets</p>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="bg-ak-surface/60 border border-ak-line rounded-none p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Incoming Inquiries (Recent)
                  </h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-ak-accent hover:text-ak-accent-light font-semibold"
                  >
                    View All {inquiries.length} Inquiries &rarr;
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <p className="text-xs text-ak-muted italic py-4">No inquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-ak-line text-ak-muted uppercase tracking-wider">
                          <th className="py-2">Ref Code</th>
                          <th className="py-2">Applicant</th>
                          <th className="py-2">Phone / Contact</th>
                          <th className="py-2">Goal / Program</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ak-line/60">
                        {inquiries.slice(0, 5).map((inq) => (
                          <tr key={inq.id} className="hover:bg-ak-surface/50">
                            <td className="py-2.5 font-mono font-bold text-ak-accent">{inq.referenceCode}</td>
                            <td className="py-2.5 font-semibold text-white">{inq.fullName}</td>
                            <td className="py-2.5 text-white">{inq.phone}</td>
                            <td className="py-2.5 capitalize text-ak-muted">
                              {inq.program || inq.goal}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  inq.status === 'new'
                                    ? 'bg-ak-accent/10 text-ak-accent border border-ak-accent/40'
                                    : inq.status === 'contacted'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : inq.status === 'enrolled'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-ak-surface-2 text-ak-muted'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-right">
                              <a
                                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                                  inq.fullName
                                )}%2C%20this%20is%20Gorkhali%20Gym%20front%20desk%20regarding%20your%20application%20(Ref%3A%20${
                                  inq.referenceCode
                                }).`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES & LEADS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Inquiries &amp; Membership Leads
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Review and update lead pipeline with direct WhatsApp outreach and administrative notes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ak-muted" />
                    <input
                      type="text"
                      placeholder="Search name, phone, ref..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="bg-ak-surface border border-ak-line rounded-none pl-9 pr-4 py-2 text-xs text-white placeholder:text-ak-muted focus:outline-none focus:border-ak-accent w-48 sm:w-64"
                    />
                  </div>
                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    className="bg-ak-surface border border-ak-line rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-ak-accent"
                  >
                    <option value="all">All Statuses ({inquiries.length})</option>
                    <option value="new">New ({inquiries.filter((i) => i.status === 'new').length})</option>
                    <option value="contacted">
                      Contacted ({inquiries.filter((i) => i.status === 'contacted').length})
                    </option>
                    <option value="enrolled">
                      Enrolled ({inquiries.filter((i) => i.status === 'enrolled').length})
                    </option>
                    <option value="archived">
                      Archived ({inquiries.filter((i) => i.status === 'archived').length})
                    </option>
                  </select>
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="bg-ak-surface/40 border border-ak-line rounded-none p-12 text-center text-ak-muted">
                  <Inbox className="w-10 h-10 mx-auto text-ak-muted mb-2" />
                  <p className="text-sm font-semibold">No inquiries matching filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ak-line/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-ak-accent">
                            {inq.referenceCode}
                          </span>
                          <span className="text-base font-bold text-white">{inq.fullName}</span>
                          <span className="text-xs text-ak-muted">{inq.phone}</span>
                          {inq.email && <span className="text-xs text-ak-muted">({inq.email})</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              updateInquiryStatus(inq.id, e.target.value as InquiryItem['status'])
                            }
                            className="bg-ak-ink border border-ak-line rounded-none px-2.5 py-1 text-xs font-bold uppercase focus:outline-none focus:border-ak-accent"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="converted">Converted</option>
                            <option value="archived">Archived</option>
                          </select>
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                              inq.fullName
                            )}%2C%20this%20is%20Gorkhali%20Gym%20front%20desk%20regarding%20your%20application%20(Ref%3A%20${
                              inq.referenceCode
                            }).`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={() => deleteInquiryItem(inq.id)}
                            className="p-1.5 rounded-none bg-ak-ink border border-ak-line hover:text-ak-accent-light text-ak-muted transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-ak-muted block uppercase text-[10px] font-bold">
                            Goal / Target
                          </span>
                          <span className="text-white capitalize font-medium">{inq.goal}</span>
                        </div>
                        <div>
                          <span className="text-ak-muted block uppercase text-[10px] font-bold">
                            Program / Offer
                          </span>
                          <span className="text-white font-medium">
                            {inq.program || inq.selectedOffer || 'General Admission'}
                          </span>
                        </div>
                        <div>
                          <span className="text-ak-muted block uppercase text-[10px] font-bold">
                            Preferred Time &bull; Date
                          </span>
                          <span className="text-white capitalize font-medium">
                            {inq.preferredTime || 'Anytime'} &bull;{' '}
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {inq.message && (
                        <div className="bg-ak-ink/60 p-3 rounded-none border border-ak-line/60 text-xs text-white">
                          <span className="text-[10px] font-bold uppercase text-ak-muted block mb-0.5">
                            Applicant Note:
                          </span>
                          {inq.message}
                        </div>
                      )}

                      {/* Admin Notes */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Admin notes (e.g. Called on 12th, scheduled induction for Friday 6pm)..."
                          defaultValue={inq.adminNotes || ''}
                          onBlur={(e) => {
                            if (e.target.value !== (inq.adminNotes || '')) {
                              updateInquiryStatus(inq.id, inq.status, e.target.value);
                            }
                          }}
                          className="flex-1 bg-ak-ink border border-ak-line/80 rounded-none px-3 py-1.5 text-xs text-white placeholder:text-ak-muted focus:outline-none focus:border-ak-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BUSINESS SETTINGS & BRANDING */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Business Settings &amp; Branding
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Official gym details, colors, contacts, and SEO settings synchronized across the site.
                  </p>
                </div>
                <button
                  onClick={saveSettings}
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-ak-accent hover:bg-ak-accent-light disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-ak-accent/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>

              <div className="bg-ak-surface/80 border border-ak-line rounded-none p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Gym Legal / Brand Name
                    </label>
                    <input
                      type="text"
                      value={settings.gymName}
                      onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Contact Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail || ''}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value || null })}
                      placeholder="info@gorkhaligym.com"
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      WhatsApp Number (International format)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Physical Street Address
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Daily Opening Hours
                    </label>
                    <input
                      type="text"
                      value={settings.openingHours}
                      onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={settings.mapUrl}
                    onChange={(e) => setSettings({ ...settings, mapUrl: e.target.value })}
                    className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-sm focus:outline-none focus:border-ak-accent font-mono text-xs"
                  />
                </div>

                {/* Theme Colors & Logos */}
                <div className="pt-4 border-t border-ak-line/80">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                    Visual Branding &amp; Colors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded border border-ak-line bg-ak-ink cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="flex-1 bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">
                        Secondary Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded border border-ak-line bg-ak-ink cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="flex-1 bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">
                        Dark Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.darkBackground}
                          onChange={(e) => setSettings({ ...settings, darkBackground: e.target.value })}
                          className="w-10 h-10 rounded border border-ak-line bg-ak-ink cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.darkBackground}
                          onChange={(e) => setSettings({ ...settings, darkBackground: e.target.value })}
                          className="flex-1 bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <ImagePickerField
                      label="Site Logo (used in header)"
                      value={settings.logoUrl || ''}
                      onChange={(url) => setSettings({ ...settings, logoUrl: url || null })}
                      mediaAssets={mediaAssets}
                      onUploadSuccess={(a) => setMediaAssets((prev) => [a as MediaAssetItem, ...prev])}
                      placeholder="/images/logo.png or https://..."
                      previewHeight="h-24"
                    />
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                        Favicon URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="/favicon.ico or https://..."
                        value={settings.faviconUrl || ''}
                        onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value || null })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-ak-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-ak-line/80">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                    Social Media Profiles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settings.facebookUrl}
                        onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={settings.instagramUrl}
                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">TikTok URL</label>
                      <input
                        type="url"
                        value={settings.tiktokUrl}
                        onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer and SEO */}
                <div className="pt-4 border-t border-ak-line/80">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                    Footer &amp; Global SEO Metadata
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">
                        Footer Description
                      </label>
                      <textarea
                        rows={2}
                        value={settings.footerDescription}
                        onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">Copyright Text</label>
                      <input
                        type="text"
                        value={settings.copyrightText}
                        onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">Default Meta Title</label>
                      <input
                        type="text"
                        value={settings.metaTitle}
                        onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ak-muted mb-1">
                        Default Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={settings.metaDescription}
                        onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAGE & SECTIONS EDITOR */}
          {activeTab === 'sections' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Page &amp; Section Editor
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Edit page headlines, body copy, images, CTAs, and toggle or reorder sections per page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newSec: PageSectionItem = {
                      id: `sec-${Date.now()}`,
                      pageSlug: sectionPageFilter,
                      sectionKey: `custom-${Date.now()}`,
                      heading: 'New Section Headline',
                      subheading: 'Subtitle description',
                      bodyText: 'Body paragraph text for this section.',
                      imageUrl: '/images/hero_gorkhali_gym.jpg',
                      ctaLabel: 'Learn More',
                      ctaUrl: '/training',
                      displayOrder:
                        sections.filter((s) => s.pageSlug === sectionPageFilter).length + 1,
                      isVisible: true,
                    };
                    saveSectionItem(newSec);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-ak-muted">
                  Page
                </label>
                <select
                  value={sectionPageFilter}
                  onChange={(e) => setSectionPageFilter(e.target.value)}
                  className="bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-sm text-white min-w-[16rem]"
                >
                  {Array.from(
                    new Set([
                      'home',
                      'about',
                      'services',
                      'training',
                      'membership',
                      'membership/club',
                      'membership/refer-a-friend',
                      'team',
                      'gallery',
                      'blog',
                      'faq',
                      'offers',
                      'events',
                      'reviews',
                      'contact',
                      'apply',
                      ...sections.map((s) => s.pageSlug),
                    ])
                  ).map((slug) => (
                    <option key={slug} value={slug}>
                      {slug}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {sections
                  .filter((sec) => sec.pageSlug === sectionPageFilter)
                  .map((sec, idx, pageSections) => (
                  <div
                    key={sec.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-ak-line pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-ak-accent">#{sec.displayOrder}</span>
                        <span className="text-xs font-bold text-ak-muted uppercase tracking-wider">
                          Key: {sec.sectionKey} (Page: {sec.pageSlug})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx === 0) return;
                              const prev = pageSections[idx - 1];
                              const current = pageSections[idx];
                              saveSectionItem({ ...current, displayOrder: prev.displayOrder });
                              saveSectionItem({ ...prev, displayOrder: current.displayOrder });
                            }}
                            className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-white disabled:opacity-30 border border-ak-line"
                            title="Move section up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === pageSections.length - 1}
                            onClick={() => {
                              if (idx === pageSections.length - 1) return;
                              const next = pageSections[idx + 1];
                              const current = pageSections[idx];
                              saveSectionItem({ ...current, displayOrder: next.displayOrder });
                              saveSectionItem({ ...next, displayOrder: current.displayOrder });
                            }}
                            className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-white disabled:opacity-30 border border-ak-line"
                            title="Move section down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            const updated = { ...sec, isVisible: !sec.isVisible };
                            saveSectionItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            sec.isVisible
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {sec.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteSectionItem(sec.id)}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => {
                            const updated = { ...sec, heading: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Subheading
                        </label>
                        <input
                          type="text"
                          value={sec.subheading || ''}
                          onChange={(e) => {
                            const updated = { ...sec, subheading: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                        Body Text
                      </label>
                      <textarea
                        rows={2}
                        value={sec.bodyText || ''}
                        onChange={(e) => {
                          const updated = { ...sec, bodyText: e.target.value };
                          setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                        }}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <ImagePickerField
                          label="Background Image"
                          value={sec.imageUrl || ''}
                          onChange={(url) => {
                            const updated = { ...sec, imageUrl: url };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          mediaAssets={mediaAssets}
                          onUploadSuccess={(a) => setMediaAssets((prev) => [a as MediaAssetItem, ...prev])}
                          previewHeight="h-28"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          CTA Button Label
                        </label>
                        <input
                          type="text"
                          value={sec.ctaLabel || ''}
                          onChange={(e) => {
                            const updated = { ...sec, ctaLabel: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          CTA Destination URL
                        </label>
                        <input
                          type="text"
                          value={sec.ctaUrl || ''}
                          onChange={(e) => {
                            const updated = { ...sec, ctaUrl: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveSectionItem(sec)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Section</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NAVIGATION & FOOTER */}
          {activeTab === 'navigation' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Navigation &amp; Footer Manager
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Manage top bar menu items, nested dropdown links, labels, and URL destinations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newItem: NavigationItemType = {
                      id: `nav-${Date.now()}`,
                      label: 'New Link',
                      href: '/custom',
                      displayOrder: navigation.length + 1,
                      isPublished: true,
                    };
                    saveNavigationItem(newItem);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Navigation Link</span>
                </button>
              </div>

              <div className="space-y-4">
                {navigation.map((item) => (
                  <div
                    key={item.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-ak-accent">#{item.displayOrder}</span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = { ...item, label: e.target.value };
                            setNavigation(navigation.map((n) => (n.id === item.id ? updated : n)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-sm font-bold text-white w-48"
                        />
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const updated = { ...item, href: e.target.value };
                            setNavigation(navigation.map((n) => (n.id === item.id ? updated : n)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white font-mono w-48"
                        />
                        <select
                          value={item.location === 'footer' ? 'footer' : 'header'}
                          onChange={(e) => {
                            const updated: NavigationItemType = {
                              ...item,
                              location: e.target.value === 'footer' ? 'footer' : 'header',
                            };
                            setNavigation(navigation.map((n) => (n.id === item.id ? updated : n)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-2 py-1.5 text-xs text-white"
                          title="Where this link appears"
                        >
                          <option value="header">Header</option>
                          <option value="footer">Footer</option>
                        </select>
                        {item.location === 'footer' && (
                          <input
                            type="text"
                            value={item.footerColumn || ''}
                            placeholder="Footer column (blank = bottom bar)"
                            onChange={(e) => {
                              const updated = { ...item, footerColumn: e.target.value };
                              setNavigation(navigation.map((n) => (n.id === item.id ? updated : n)));
                            }}
                            className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white w-52"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...item, isPublished: !item.isPublished };
                            saveNavigationItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            item.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {item.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => saveNavigationItem(item)}
                          className="p-1.5 rounded-none bg-ak-ink text-white hover:text-white border border-ak-line"
                          title="Save link"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNavigationItem(item.id)}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent border border-ak-line"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Nested Children (if any) */}
                    {item.children && item.children.length > 0 && (
                      <div className="pl-6 border-l-2 border-ak-line space-y-2 pt-2">
                        <span className="text-[10px] uppercase font-bold text-ak-muted tracking-wider">
                          Dropdown Children:
                        </span>
                        {item.children.map((child, cIdx) => (
                          <div key={child.id || cIdx} className="flex items-center gap-2 text-xs">
                            <span className="text-ak-muted">&bull;</span>
                            <span className="font-semibold text-white">{child.label}</span>
                            <span className="text-ak-muted font-mono text-[11px]">({child.href})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ANNOUNCEMENT BANNER */}
          {activeTab === 'announcement' && announcement && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Announcement Banner
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Top alert strip for promotions, holiday hours, or urgent notices.
                  </p>
                </div>
                <button
                  onClick={saveAnnouncement}
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-ak-accent hover:bg-ak-accent-light disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-ak-accent/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving...' : 'Save & Publish'}</span>
                </button>
              </div>

              {/* Real-time Live Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ak-muted">
                  Live Banner Preview:
                </span>
                <div className="h-9 min-h-[36px] max-h-[36px] bg-ak-accent/10 border border-ak-accent/40 text-white px-4 text-xs font-medium rounded-none flex items-center justify-center overflow-hidden shadow-inner">
                  <div className="flex items-center justify-center gap-2 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-ak-accent shrink-0" />
                    <span className="truncate">{announcement.text}</span>
                    {announcement.linkUrl && (
                      <span className="underline text-white font-bold ml-1.5 whitespace-nowrap">
                        {announcement.linkLabel || 'Details →'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-ak-surface/80 border border-ak-line rounded-none p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-ak-line pb-4">
                  <div>
                    <label className="text-sm font-bold text-white uppercase tracking-wider">
                      Banner Status
                    </label>
                    <p className="text-xs text-ak-muted">
                      When enabled, displays at the very top of the public website.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnnouncement({ ...announcement, isActive: !announcement.isActive })}
                    className={`px-4 py-2 rounded-none text-xs font-bold uppercase transition-colors ${
                      announcement.isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                        : 'bg-ak-surface-2 text-ak-muted'
                    }`}
                  >
                    {announcement.isActive ? 'Active (Enabled)' : 'Disabled'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                    Announcement Text
                  </label>
                  <textarea
                    rows={2}
                    value={announcement.text}
                    onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                    className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-sm text-white focus:outline-none focus:border-ak-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Link Destination URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="/apply or /offers"
                      value={announcement.linkUrl || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value || null })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-ak-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Link Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Join Now or View Offer →"
                      value={announcement.linkLabel || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, linkLabel: e.target.value || null })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2.5 text-xs text-white focus:outline-none focus:border-ak-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ak-muted mb-1">
                      Valid From (Optional Start Date)
                    </label>
                    <input
                      type="datetime-local"
                      value={announcement.startDate ? announcement.startDate.slice(0, 16) : ''}
                      onChange={(e) =>
                        setAnnouncement({
                          ...announcement,
                          startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                        })
                      }
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-xs text-white focus:outline-none focus:border-ak-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ak-muted mb-1">
                      Valid Until (Optional Expiry Date)
                    </label>
                    <input
                      type="datetime-local"
                      value={announcement.endDate ? announcement.endDate.slice(0, 16) : ''}
                      onChange={(e) =>
                        setAnnouncement({
                          ...announcement,
                          endDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                        })
                      }
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-xs text-white focus:outline-none focus:border-ak-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TRAINING PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Training Programs
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Manage Strength Training, Personal Coaching, and Yoga classes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newProg: ProgramItem = {
                      id: `prog-${Date.now()}`,
                      slug: `program-${Date.now()}`,
                      title: 'New Training Program',
                      category: 'training',
                      shortDesc: 'Short description for cards and previews.',
                      fullDesc: 'Comprehensive breakdown of program details and mechanics.',
                      imageUrl: '/images/training_strength_gym.jpg',
                      badge: 'New',
                      duration: '60 mins',
                      features: ['Olympic Barbells', 'Certified Coach Supervision'],
                      ctaLabel: 'Apply Now',
                      displayOrder: programs.length + 1,
                      isPublished: true,
                      publishedAt: new Date().toISOString(),
                    };
                    saveProgramItem(newProg);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Training Program</span>
                </button>
              </div>

              <div className="space-y-4">
                {programs.map((prog) => (
                  <div
                    key={prog.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-ak-line pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-ak-accent">#{prog.displayOrder}</span>
                        <input
                          type="text"
                          value={prog.title}
                          onChange={(e) => {
                            const updated = { ...prog, title: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                        <span className="text-xs font-mono text-ak-muted">slug: /{prog.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...prog, isPublished: !prog.isPublished };
                            saveProgramItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            prog.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {prog.isPublished ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => deleteProgramItem(prog.id, 'training')}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={prog.shortDesc}
                          onChange={(e) => {
                            const updated = { ...prog, shortDesc: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Full Description
                        </label>
                        <textarea
                          rows={2}
                          value={prog.fullDesc}
                          onChange={(e) => {
                            const updated = { ...prog, fullDesc: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <ImagePickerField
                          label="Program Image"
                          value={prog.imageUrl}
                          onChange={(url) => {
                            const updated = { ...prog, imageUrl: url };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          mediaAssets={mediaAssets}
                          onUploadSuccess={(a) => setMediaAssets((prev) => [a as MediaAssetItem, ...prev])}
                          previewHeight="h-32"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={prog.duration || ''}
                          onChange={(e) => {
                            const updated = { ...prog, duration: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Badge (e.g. Popular)
                        </label>
                        <input
                          type="text"
                          value={prog.badge || ''}
                          onChange={(e) => {
                            const updated = { ...prog, badge: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveProgramItem(prog)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Program</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: GENERAL SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    General Services
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Manage nutrition consultations, body composition assessments, and health services.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newSrv: ProgramItem = {
                      id: `srv-${Date.now()}`,
                      slug: `service-${Date.now()}`,
                      title: 'New Service Offering',
                      category: 'service',
                      shortDesc: 'Service overview and details.',
                      fullDesc: 'Comprehensive service breakdown.',
                      imageUrl: '/images/hero_gorkhali_gym.jpg',
                      badge: 'Service',
                      duration: '45 mins',
                      features: ['Personal Assessment', 'Nutritional Template'],
                      ctaLabel: 'Book Consultation',
                      displayOrder: services.length + 1,
                      isPublished: true,
                      publishedAt: new Date().toISOString(),
                    };
                    saveProgramItem(newSrv);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="space-y-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-ak-line pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-ak-accent">#{srv.displayOrder}</span>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const updated = { ...srv, title: e.target.value };
                            setServices(services.map((s) => (s.id === s.id ? updated : s)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                        <span className="text-xs font-mono text-ak-muted">slug: /{srv.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...srv, isPublished: !srv.isPublished };
                            saveProgramItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            srv.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {srv.isPublished ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => deleteProgramItem(srv.id, 'service')}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={srv.shortDesc}
                          onChange={(e) => {
                            const updated = { ...srv, shortDesc: e.target.value };
                            setServices(services.map((s) => (s.id === srv.id ? updated : s)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Full Description
                        </label>
                        <textarea
                          rows={2}
                          value={srv.fullDesc}
                          onChange={(e) => {
                            const updated = { ...srv, fullDesc: e.target.value };
                            setServices(services.map((s) => (s.id === srv.id ? updated : s)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveProgramItem(srv)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: MEMBERSHIPS & REFERRAL */}
          {activeTab === 'memberships' && (
            <div className="space-y-8 max-w-4xl">
              {/* Membership Plans Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                      Membership Plans
                    </h2>
                    <p className="text-xs text-ak-muted">
                      Manage membership tiers, features, prices, and published state.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPlan: MembershipPlanItem = {
                        id: `plan-${Date.now()}`,
                        slug: `plan-${Date.now()}`,
                        name: 'New Membership Plan',
                        priceInfo: 'Contact Front Desk for Rates',
                        period: 'Monthly',
                        description: 'Membership plan description.',
                        features: ['Full gym access', 'Locker storage'],
                        isFeatured: false,
                        displayOrder: memberships.length + 1,
                        isPublished: true,
                      };
                      saveMembershipItem(newPlan);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Plan</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {memberships.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-ak-line pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-ak-accent">#{plan.displayOrder}</span>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const updated = { ...plan, name: e.target.value };
                              setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                            }}
                            className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-base font-bold text-white w-64"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = { ...plan, isPublished: !plan.isPublished };
                              saveMembershipItem(updated);
                            }}
                            className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                              plan.isPublished
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-ak-surface-2 text-ak-muted'
                            }`}
                          >
                            {plan.isPublished ? 'Published' : 'Unpublished'}
                          </button>
                          <button
                            onClick={() => deleteMembershipItem(plan.id)}
                            className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                            Pricing Notice (Unconfirmed rates remain inquiry-based)
                          </label>
                          <input
                            type="text"
                            value={plan.priceInfo || ''}
                            onChange={(e) => {
                              const updated = { ...plan, priceInfo: e.target.value };
                              setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                            }}
                            className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                            Duration / Period
                          </label>
                          <input
                            type="text"
                            value={plan.period || ''}
                            onChange={(e) => {
                              const updated = { ...plan, period: e.target.value };
                              setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                            }}
                            className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={plan.description}
                          onChange={(e) => {
                            const updated = { ...plan, description: e.target.value };
                            setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => saveMembershipItem(plan)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Plan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral Program Section */}
              {referral && (
                <div className="bg-ak-surface/80 border border-ak-line rounded-none p-6 space-y-4 pt-6">
                  <div className="flex items-center justify-between border-b border-ak-line pb-3">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        Referral Program Settings
                      </h3>
                      <p className="text-xs text-ak-muted">
                        Rules, benefits, and active state for the Refer-a-Friend promotion.
                      </p>
                    </div>
                    <button
                      onClick={() => setReferral({ ...referral, isActive: !referral.isActive })}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase ${
                        referral.isActive
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-ak-surface-2 text-ak-muted'
                      }`}
                    >
                      {referral.isActive ? 'Program Active' : 'Program Inactive'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                      Program Title
                    </label>
                    <input
                      type="text"
                      value={referral.title}
                      onChange={(e) => setReferral({ ...referral, title: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                      Benefit Description
                    </label>
                    <textarea
                      rows={2}
                      value={referral.benefitText}
                      onChange={(e) => setReferral({ ...referral, benefitText: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                      Terms &amp; Eligibility Rules
                    </label>
                    <textarea
                      rows={3}
                      value={referral.rules}
                      onChange={(e) => setReferral({ ...referral, rules: e.target.value })}
                      className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={saveReferralItem}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Referral Rules</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: OFFERS & PROMOTIONS */}
          {activeTab === 'offers' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Promotional Offers
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Discounts, seasonal trials, and welcome passes with validity dates.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newOffer: OfferItem = {
                      id: `off-${Date.now()}`,
                      slug: `offer-${Date.now()}`,
                      title: 'New Promotional Offer',
                      badge: 'Special',
                      shortDesc: 'Offer summary description.',
                      fullDesc: 'Comprehensive details on this promotional pass.',
                      discountInfo: 'Discount or Bonus',
                      imageUrl: '/images/hero_gorkhali_gym.jpg',
                      validUntil: '2026-12-31T23:59:59Z',
                      displayOrder: offers.length + 1,
                      isPublished: true,
                    };
                    saveOfferItem(newOffer);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Offer</span>
                </button>
              </div>

              <div className="space-y-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-ak-line pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-ak-accent">#{offer.displayOrder}</span>
                        <input
                          type="text"
                          value={offer.title}
                          onChange={(e) => {
                            const updated = { ...offer, title: e.target.value };
                            setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                        <span className="text-xs font-mono text-ak-muted">/{offer.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...offer, isPublished: !offer.isPublished };
                            saveOfferItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            offer.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {offer.isPublished ? 'Published' : 'Unpublished'}
                        </button>
                        <button
                          onClick={() => deleteOfferItem(offer.id)}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Badge (e.g. Limited Offer)
                        </label>
                        <input
                          type="text"
                          value={offer.badge || ''}
                          onChange={(e) => {
                            const updated = { ...offer, badge: e.target.value };
                            setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Discount / Benefit Details
                        </label>
                        <input
                          type="text"
                          value={offer.discountInfo || ''}
                          onChange={(e) => {
                            const updated = { ...offer, discountInfo: e.target.value };
                            setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Valid Until Date
                        </label>
                        <input
                          type="datetime-local"
                          value={offer.validUntil ? offer.validUntil.slice(0, 16) : ''}
                          onChange={(e) => {
                            const updated = {
                              ...offer,
                              validUntil: e.target.value ? new Date(e.target.value).toISOString() : null,
                            };
                            setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={offer.shortDesc}
                        onChange={(e) => {
                          const updated = { ...offer, shortDesc: e.target.value };
                          setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                        }}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveOfferItem(offer)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Offer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: EVENTS & WORKSHOPS */}
          {activeTab === 'events' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Events, Seminars &amp; Clinics
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Lifting clinics, seminars, mobility sessions, and competitions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newEvt: EventItem = {
                      id: `evt-${Date.now()}`,
                      slug: `event-${Date.now()}`,
                      title: 'New Fitness Event',
                      date: new Date(Date.now() + 14 * 86400000).toISOString(),
                      location: 'Gorkhali Gym, Dharan Road, Itahari',
                      shortDesc: 'Event brief.',
                      fullDesc: 'Comprehensive event curriculum.',
                      imageUrl: '/images/training_strength_gym.jpg',
                      displayOrder: events.length + 1,
                      isPublished: true,
                    };
                    saveEventItem(newEvt);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-ak-line pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-ak-accent">#{evt.displayOrder}</span>
                        <input
                          type="text"
                          value={evt.title}
                          onChange={(e) => {
                            const updated = { ...evt, title: e.target.value };
                            setEvents(events.map((eItem) => (eItem.id === evt.id ? updated : eItem)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...evt, isPublished: !evt.isPublished };
                            saveEventItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            evt.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {evt.isPublished ? 'Published' : 'Unpublished'}
                        </button>
                        <button
                          onClick={() => deleteEventItem(evt.id)}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={evt.date ? evt.date.slice(0, 16) : ''}
                          onChange={(e) => {
                            const updated = {
                              ...evt,
                              date: e.target.value ? new Date(e.target.value).toISOString() : evt.date,
                            };
                            setEvents(events.map((eItem) => (eItem.id === evt.id ? updated : eItem)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Location Venue
                        </label>
                        <input
                          type="text"
                          value={evt.location}
                          onChange={(e) => {
                            const updated = { ...evt, location: e.target.value };
                            setEvents(events.map((eItem) => (eItem.id === evt.id ? updated : eItem)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                        Full Description
                      </label>
                      <textarea
                        rows={2}
                        value={evt.fullDesc}
                        onChange={(e) => {
                          const updated = { ...evt, fullDesc: e.target.value };
                          setEvents(events.map((eItem) => (eItem.id === evt.id ? updated : eItem)));
                        }}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveEventItem(evt)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Event</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: TRAINERS & COACHES */}
          {activeTab === 'trainers' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Trainers &amp; Staff Profiles
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Certified coaches, verified credentials, and biographies.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newTrainer: TrainerItem = {
                      id: `tr-${Date.now()}`,
                      name: 'Coach Name',
                      role: 'Certified Trainer',
                      bio: 'Dedicated coach bio and lifting background.',
                      qualifications: ['Certified Personal Trainer', 'Barbell Mechanics'],
                      imageUrl: '/images/trainer_coaching_session.jpg',
                      facebookUrl: null,
                      instagramUrl: null,
                      whatsappUrl: null,
                      email: null,
                      displayOrder: trainers.length + 1,
                      isPublished: true,
                    };
                    saveTrainerItem(newTrainer);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trainer</span>
                </button>
              </div>

              <div className="space-y-4">
                {trainers.map((tr) => (
                  <div
                    key={tr.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-ak-line pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-ak-accent">#{tr.displayOrder}</span>
                        <input
                          type="text"
                          value={tr.name}
                          onChange={(e) => {
                            const updated = { ...tr, name: e.target.value };
                            setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-base font-bold text-white w-60"
                        />
                        <input
                          type="text"
                          placeholder="Role / Title"
                          value={tr.role}
                          onChange={(e) => {
                            const updated = { ...tr, role: e.target.value };
                            setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white w-52"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...tr, isPublished: !tr.isPublished };
                            saveTrainerItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            tr.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {tr.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteTrainerItem(tr.id)}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                        Biography
                      </label>
                      <textarea
                        rows={2}
                        value={tr.bio}
                        onChange={(e) => {
                          const updated = { ...tr, bio: e.target.value };
                          setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                        }}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Qualifications (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={tr.qualifications.join(', ')}
                          onChange={(e) => {
                            const quals = e.target.value
                              .split(',')
                              .map((q) => q.trim())
                              .filter(Boolean);
                            const updated = { ...tr, qualifications: quals };
                            setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                          }}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <ImagePickerField
                          label="Profile Photo"
                          value={tr.imageUrl || ''}
                          onChange={(url) => {
                            const updated = { ...tr, imageUrl: url };
                            setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                          }}
                          mediaAssets={mediaAssets}
                          onUploadSuccess={(a) => setMediaAssets((prev) => [a as MediaAssetItem, ...prev])}
                          previewHeight="h-32"
                          round={true}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveTrainerItem(tr)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Profile</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: REVIEWS & MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Member Reviews &amp; Moderation
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Public submissions require moderator approval before appearing on the live website.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase ${
                      reviewFilter === 'all' ? 'bg-ak-accent text-white' : 'bg-ak-surface text-ak-muted'
                    }`}
                  >
                    All ({reviews.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('pending')}
                    className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase ${
                      reviewFilter === 'pending'
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-ak-surface text-ak-muted'
                    }`}
                  >
                    Pending ({reviews.filter((r) => !r.isPublished).length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('published')}
                    className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase ${
                      reviewFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-ak-surface text-ak-muted'
                    }`}
                  >
                    Approved ({reviews.filter((r) => r.isPublished).length})
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="bg-ak-surface/40 border border-ak-line rounded-none p-12 text-center text-ak-muted">
                    <Star className="w-10 h-10 mx-auto text-ak-muted mb-2" />
                    <p className="text-sm font-semibold">No reviews matching filter.</p>
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-ak-line/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-sm">{rev.author}</span>
                          <span className="text-amber-400 font-bold text-xs flex items-center">
                            {'★'.repeat(rev.rating)}
                            <span className="text-ak-muted text-xs ml-1">({rev.rating}/5)</span>
                          </span>
                          <span className="text-ak-muted text-xs">
                            {new Date(rev.reviewDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {rev.isPublished ? (
                            <button
                              onClick={() => saveReviewModeration(rev, false)}
                              className="px-3 py-1 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white text-xs font-bold uppercase"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              onClick={() => saveReviewModeration(rev, true)}
                              className="px-3 py-1 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase shadow-sm"
                            >
                              Approve &amp; Publish
                            </button>
                          )}
                          <button
                            onClick={() => deleteReviewItem(rev.id)}
                            className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-white leading-relaxed">{rev.fullText}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 14: FACILITY GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 max-w-5xl">
              <SectionHeader
                eyebrow="Media"
                title="Facility Gallery Photos"
                description="Manage photos of the barbell floor, racks, coaching, and amenities. Upload via Media Library then paste the URL here."
                action={
                  <button
                    onClick={() => {
                      const newGal: GalleryItem = {
                        id: `gal-${Date.now()}`,
                        title: 'New Gym Photo',
                        caption: '',
                        orientation: 'landscape',
                        category: 'equipment',
                        imageUrl: '',
                        displayOrder: gallery.length + 1,
                        isPublished: false,
                      };
                      newGalleryDraftIds.current.add(newGal.id);
                      setGallery((prev) => [...prev, newGal]);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                }
              />

              {gallery.length === 0 ? (
                <div className="bg-ak-surface/40 border border-dashed border-ak-line rounded-none p-16 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-ak-muted mb-3" />
                  <p className="text-sm font-semibold text-ak-muted">No gallery photos yet.</p>
                  <p className="text-xs text-ak-muted mt-1">Click &quot;Add Photo&quot; to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="bg-ak-surface/80 border border-ak-line rounded-none overflow-hidden"
                    >
                      {/* Image Preview */}
                      <div className="relative w-full h-48 bg-ak-ink flex items-center justify-center overflow-hidden">
                        {g.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={g.imageUrl}
                            alt={g.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-ak-muted">
                            <ImageIcon className="w-10 h-10" />
                            <span className="text-xs">No image URL set</span>
                          </div>
                        )}
                        {/* Status badge overlay */}
                        <div className="absolute top-2 left-2">
                          <button
                            onClick={() => toggleGalleryPublish(g)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-lg backdrop-blur-sm transition-colors ${
                              g.isPublished
                                ? 'bg-emerald-600/90 text-white hover:bg-emerald-500'
                                : 'bg-ak-surface-2/90 text-ak-muted hover:bg-ak-surface-2'
                            }`}
                          >
                            {g.isPublished ? '● Visible' : '○ Hidden'}
                          </button>
                        </div>
                        {/* Delete button overlay */}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => deleteGalleryItem(g.id)}
                            className="p-1.5 rounded-none bg-ak-accent/10 border border-ak-accent/40 text-ak-accent hover:bg-ak-accent/15 hover:text-ak-accent-light transition-colors backdrop-blur-sm"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Edit Fields */}
                      <div className="p-4 space-y-3">
                        {/* Title */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-ak-muted mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={g.title}
                            onChange={(e) => {
                              setGallery(gallery.map((item) =>
                                item.id === g.id ? { ...item, title: e.target.value } : item
                              ));
                            }}
                            placeholder="e.g. Main Strength Floor"
                            className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-ak-accent transition-colors"
                          />
                        </div>

                        {/* Image URL */}
                        <ImagePickerField
                          label="Image"
                          value={g.imageUrl}
                          onChange={(url) => {
                            const updated = { ...g, imageUrl: url };
                            setGallery(gallery.map((item) =>
                              item.id === g.id ? updated : item
                            ));
                            // Auto-persist a new draft as soon as it has an image
                            if (url && newGalleryDraftIds.current.has(g.id)) {
                              newGalleryDraftIds.current.delete(g.id);
                              saveGalleryItem(updated);
                            }
                          }}
                          mediaAssets={mediaAssets}
                          onUploadSuccess={(a) => setMediaAssets((prev) => [a as MediaAssetItem, ...prev])}
                          previewHeight="h-40"
                        />

                        {/* Caption */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-ak-muted mb-1">
                            Caption
                          </label>
                          <input
                            type="text"
                            placeholder="Short description shown below photo"
                            value={g.caption || ''}
                            onChange={(e) => {
                              setGallery(gallery.map((item) =>
                                item.id === g.id ? { ...item, caption: e.target.value } : item
                              ));
                            }}
                            className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-ak-accent transition-colors"
                          />
                        </div>

                        {/* Category + Orientation row */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-ak-muted mb-1">
                              Category
                            </label>
                            <select
                              value={g.category}
                              onChange={(e) => {
                                setGallery(gallery.map((item) =>
                                  item.id === g.id ? { ...item, category: e.target.value } : item
                                ));
                              }}
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-ak-accent"
                            >
                              <option value="equipment">Equipment</option>
                              <option value="training">Training</option>
                              <option value="facility">Facility</option>
                              <option value="events">Events</option>
                              <option value="community">Community</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-ak-muted mb-1">
                              Orientation
                            </label>
                            <select
                              value={g.orientation}
                              onChange={(e) => {
                                setGallery(gallery.map((item) =>
                                  item.id === g.id ? { ...item, orientation: e.target.value as 'landscape' | 'portrait' } : item
                                ));
                              }}
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-ak-accent"
                            >
                              <option value="landscape">Landscape</option>
                              <option value="portrait">Portrait</option>
                            </select>
                          </div>
                        </div>

                        {/* Order + Save row */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center gap-1.5">
                            <label className="text-[10px] font-bold uppercase text-ak-muted">Order</label>
                            <input
                              type="number"
                              value={g.displayOrder}
                              onChange={(e) => {
                                setGallery(gallery.map((item) =>
                                  item.id === g.id ? { ...item, displayOrder: parseInt(e.target.value) || 1 } : item
                                ));
                              }}
                              className="w-16 bg-ak-ink border border-ak-line rounded-none px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-ak-accent"
                              min={1}
                            />
                          </div>
                          <div className="flex-1" />
                          <button
                            onClick={() => saveGalleryItem(g)}
                            disabled={saveLoading}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-ak-accent hover:bg-ak-accent-light disabled:opacity-50 text-white rounded-none text-xs font-bold transition-colors"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SOCIAL VIDEOS */}
          {activeTab === 'videos' && (
            <div className="space-y-6 max-w-5xl">
              <SectionHeader
                eyebrow="Social"
                title="Social Videos"
                description="Add Facebook, Instagram, and TikTok videos by pasting the original video URL. The platform is detected automatically. Visitors watch them on the public gallery and homepage via click-to-load official embeds."
                action={
                  <button
                    onClick={() => {
                      const newVideo: SocialVideoItem = {
                        id: `vid-${Date.now()}`,
                        title: 'New Video',
                        platform: 'facebook',
                        url: '',
                        caption: '',
                        thumbnailUrl: null,
                        displayOrder: videos.length + 1,
                        isPublished: false,
                        createdAt: new Date().toISOString(),
                      };
                      newVideoDraftIds.current.add(newVideo.id);
                      setVideos((prev) => [...prev, newVideo]);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Video</span>
                  </button>
                }
              />

              {videos.length === 0 ? (
                <div className="bg-ak-surface/40 border border-dashed border-ak-line rounded-none p-16 text-center">
                  <Video className="w-12 h-12 mx-auto text-ak-muted mb-3" />
                  <p className="text-sm font-semibold text-ak-muted">No videos yet.</p>
                  <p className="text-xs text-ak-muted mt-1">
                    Click &quot;Add Video&quot; and paste a Facebook, Instagram, or TikTok video URL.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {videos.map((v, idx) => {
                    const check = validateSocialVideo(v.url);
                    const urlInvalid = v.url.trim().length > 0 && !check.ok;
                    const platformLabel = check.ok && check.platform ? PLATFORM_LABELS[check.platform] : null;
                    return (
                      <div
                        key={v.id}
                        className="bg-ak-surface/80 border border-ak-line rounded-none overflow-hidden"
                      >
                        {/* Preview */}
                        <div className="relative w-full max-w-[280px] mx-auto aspect-[9/16] bg-ak-ink flex items-center justify-center overflow-hidden">
                          {v.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={v.thumbnailUrl}
                              alt={v.title}
                              className="w-full h-full object-cover object-center"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-ak-muted">
                              <Video className="w-10 h-10" />
                              <span className="text-xs">No thumbnail (optional)</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-lg backdrop-blur-sm ${
                                platformLabel
                                  ? 'bg-sky-600/90 text-white'
                                  : v.url
                                    ? 'bg-ak-accent-dark/90 text-white'
                                    : 'bg-ak-surface-2/90 text-ak-muted'
                              }`}
                            >
                              {platformLabel || (v.url ? 'Invalid URL' : 'No URL')}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => toggleVideoPublish(v)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-lg backdrop-blur-sm transition-colors ${
                                v.isPublished
                                  ? 'bg-emerald-600/90 text-white hover:bg-emerald-500'
                                  : 'bg-ak-surface-2/90 text-ak-muted hover:bg-ak-surface-2'
                              }`}
                            >
                              {v.isPublished ? '● Published' : '○ Draft'}
                            </button>
                          </div>
                        </div>

                        {/* Edit fields */}
                        <div className="p-4 space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-ak-muted mb-1">
                              Video URL
                            </label>
                            <input
                              type="text"
                              value={v.url}
                              onChange={(e) => {
                                const url = e.target.value;
                                const updated = { ...v, url };
                                setVideos(
                                  videos.map((item) =>
                                    item.id === v.id ? updated : item
                                  )
                                );
                                // Auto-persist a new draft as soon as the URL is valid
                                if (
                                  newVideoDraftIds.current.has(v.id) &&
                                  validateSocialVideo(url).ok
                                ) {
                                  newVideoDraftIds.current.delete(v.id);
                                  saveSocialVideo(updated);
                                }
                              }}
                              placeholder="facebook.com/watch/?v=... | instagram.com/reel/... | tiktok.com/@user/video/..."
                              className={`w-full bg-ak-ink border rounded-none px-3 py-1.5 text-xs text-white font-mono focus:outline-none transition-colors ${
                                urlInvalid ? 'border-ak-accent focus:border-ak-accent' : 'border-ak-line focus:border-ak-accent'
                              }`}
                            />
                            {urlInvalid && (
                              <p className="text-[10px] text-ak-accent mt-1 flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                <span>{check.error}</span>
                              </p>
                            )}
                            {platformLabel && (
                              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Detected: {platformLabel}</span>
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-ak-muted mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={v.title}
                              onChange={(e) =>
                                setVideos(
                                  videos.map((item) =>
                                    item.id === v.id ? { ...item, title: e.target.value } : item
                                  )
                                )
                              }
                              placeholder="e.g. 400kg Deadlift PR"
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-ak-accent transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-ak-muted mb-1">
                              Caption
                            </label>
                            <input
                              type="text"
                              value={v.caption || ''}
                              onChange={(e) =>
                                setVideos(
                                  videos.map((item) =>
                                    item.id === v.id ? { ...item, caption: e.target.value } : item
                                  )
                                )
                              }
                              placeholder="Short description shown under the video"
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-ak-accent transition-colors"
                            />
                          </div>

                          <ImagePickerField
                            label="Thumbnail (optional)"
                            value={v.thumbnailUrl || ''}
                            onChange={(url) =>
                              setVideos(
                                videos.map((item) =>
                                  item.id === v.id ? { ...item, thumbnailUrl: url || null } : item
                                )
                              )
                            }
                            mediaAssets={mediaAssets}
                            onUploadSuccess={(a) => setMediaAssets((prev) => [a as MediaAssetItem, ...prev])}
                            previewHeight="h-32"
                          />

                          <div className="flex items-center gap-2 pt-1">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveVideoOrder(idx, -1)}
                                className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-white disabled:opacity-30 border border-ak-line"
                                title="Move video up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === videos.length - 1}
                                onClick={() => moveVideoOrder(idx, 1)}
                                className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-white disabled:opacity-30 border border-ak-line"
                                title="Move video down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <label className="text-[10px] font-bold uppercase text-ak-muted">Order</label>
                              <input
                                type="number"
                                value={v.displayOrder}
                                min={1}
                                onChange={(e) =>
                                  setVideos(
                                    videos.map((item) =>
                                      item.id === v.id
                                        ? { ...item, displayOrder: parseInt(e.target.value) || 1 }
                                        : item
                                    )
                                  )
                                }
                                className="w-16 bg-ak-ink border border-ak-line rounded-none px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-ak-accent"
                              />
                            </div>
                            <div className="flex-1" />
                            <a
                              href={check.ok ? check.normalizedUrl || v.url : v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-none border border-ak-line text-ak-muted hover:text-white transition-colors"
                              title="Open original video"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => deleteSocialVideo(v.id)}
                              className="p-2 rounded-none bg-ak-accent/10 border border-ak-accent/40 text-ak-accent hover:bg-ak-accent/15 hover:text-ak-accent-light transition-colors"
                              title="Delete video"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => saveSocialVideo(v)}
                              disabled={saveLoading || !v.title || !v.url || urlInvalid}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-ak-accent hover:bg-ak-accent-light disabled:opacity-40 text-white rounded-none text-xs font-bold transition-colors"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}


          {/* TAB 15: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                  Media Library &amp; Asset Storage
                </h2>
                <p className="text-xs text-ak-muted">
                  Upload files directly to persistent cloud storage (Vercel Blob), manage metadata, and reuse asset URLs.
                </p>
              </div>

              {/* Media Add Card with Mode Switch */}
              <div className="bg-ak-surface/80 border border-ak-line rounded-none p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ak-line/80 pb-4">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      {mediaSourceMode === 'url' ? (
                        <Link2 className="w-4 h-4 text-ak-accent" />
                      ) : (
                        <Upload className="w-4 h-4 text-ak-accent" />
                      )}
                      <span>{mediaSourceMode === 'url' ? 'Add External Image URL' : 'Upload File to Storage'}</span>
                    </h3>
                    <p className="text-[11px] text-ak-muted mt-0.5">
                      {mediaSourceMode === 'url'
                        ? 'Store direct image links from CDNs, image search engines, or public repositories.'
                        : 'Upload image files directly to server / persistent asset storage.'}
                    </p>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="inline-flex rounded-none bg-ak-ink p-1 border border-ak-line shrink-0">
                    <button
                      type="button"
                      onClick={() => setMediaSourceMode('url')}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                        mediaSourceMode === 'url'
                          ? 'bg-ak-accent text-white shadow-md'
                          : 'text-ak-muted hover:text-white'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Image URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaSourceMode('file')}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                        mediaSourceMode === 'file'
                          ? 'bg-ak-accent text-white shadow-md'
                          : 'text-ak-muted hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                {/* --- MODE 1: EXTERNAL IMAGE URL --- */}
                {mediaSourceMode === 'url' && (
                  <form onSubmit={handleSaveExternalUrl} className="space-y-4">
                    {externalUrlError && (
                      <div className="p-3 rounded-none bg-ak-accent/10 border border-ak-accent/40 text-ak-accent text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{externalUrlError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {/* Left: Input & metadata fields */}
                      <div className="lg:col-span-2 space-y-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                            External Image URL <span className="text-ak-accent">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={externalUrl}
                              onChange={(e) => {
                                const val = e.target.value.trim().replace(/^["']|["']$/g, '');
                                setExternalUrl(val);
                                setExternalUrlError(null);
                                if (val) setExternalImgStatus('loading');
                                else setExternalImgStatus('idle');
                              }}
                              placeholder="https://example.com/photo.jpg or https://imgs.search.brave.com/..."
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-ak-muted focus:outline-none focus:border-ak-accent transition-colors"
                            />
                            {externalUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setExternalUrl('');
                                  setExternalImgStatus('idle');
                                  setExternalUrlError(null);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ak-muted hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-ak-muted mt-1">
                            Accepts long external URLs directly from image CDNs, Unsplash, search engines, etc. Rendered directly.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                              Asset Label / Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Squat Platform"
                              value={externalFilename}
                              onChange={(e) => setExternalFilename(e.target.value)}
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white placeholder:text-ak-muted focus:outline-none focus:border-ak-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                              Alt Text (SEO)
                            </label>
                            <input
                              type="text"
                              placeholder="Description for SEO"
                              value={externalAlt}
                              onChange={(e) => setExternalAlt(e.target.value)}
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white placeholder:text-ak-muted focus:outline-none focus:border-ak-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                              Caption (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="Photo subtitle"
                              value={externalCaption}
                              onChange={(e) => setExternalCaption(e.target.value)}
                              className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white placeholder:text-ak-muted focus:outline-none focus:border-ak-accent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Preview Box */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Live URL Preview
                        </label>
                        <div className="relative w-full h-36 bg-ak-ink border border-ak-line rounded-none overflow-hidden flex items-center justify-center">
                          {externalUrl ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={externalUrl}
                                alt="Preview"
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                  externalImgStatus === 'error'
                                    ? 'opacity-20 grayscale'
                                    : externalImgStatus === 'loading'
                                    ? 'opacity-40'
                                    : 'opacity-100'
                                }`}
                                onLoad={() => setExternalImgStatus('loaded')}
                                onError={() => {
                                  setExternalImgStatus('error');
                                  setExternalUrlError(
                                    'Unable to load image from this URL. Verify it is public, not blocked (403), and returns an image format.'
                                  );
                                }}
                              />
                              {externalImgStatus === 'loading' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-1.5 text-white text-[10px]">
                                  <Loader2 className="w-5 h-5 animate-spin text-ak-accent" />
                                  <span>Testing image URL...</span>
                                </div>
                              )}
                              {externalImgStatus === 'error' && (
                                <div className="absolute inset-0 p-3 flex flex-col items-center justify-center bg-ak-accent/10 text-center gap-1 text-white">
                                  <AlertCircle className="w-5 h-5 text-ak-accent" />
                                  <span className="text-[10px] font-semibold">Image Inaccessible</span>
                                </div>
                              )}
                              {externalImgStatus === 'loaded' && (
                                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[9px] font-mono flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Image Reachable</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-ak-muted">
                              <ImageIcon className="w-6 h-6" />
                              <span className="text-[10px]">Paste URL above</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={externalUrlLoading || !externalUrl || externalImgStatus === 'error'}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-none bg-ak-accent hover:bg-ak-accent-light disabled:opacity-50 text-white font-bold text-xs uppercase shadow-md transition-all"
                      >
                        {externalUrlLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Asset...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Media Library</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* --- MODE 2: FILE UPLOAD --- */}
                {mediaSourceMode === 'file' && (
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    {uploadError && (
                      <div className="p-3 rounded-none bg-ak-accent/10 border border-ak-accent/40 text-ak-accent text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Select File
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          className="w-full text-xs text-ak-muted file:mr-2 file:py-2 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-ak-accent file:text-white hover:file:bg-ak-accent cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Alternative Text (SEO)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Olympic squat rack floor"
                          value={uploadAlt}
                          onChange={(e) => setUploadAlt(e.target.value)}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                          Caption (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Free-weight area"
                          value={uploadCaption}
                          onChange={(e) => setUploadCaption(e.target.value)}
                          className="w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={uploadLoading || !uploadFile}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-none bg-ak-accent hover:bg-ak-accent-light disabled:opacity-50 text-white font-bold text-xs uppercase shadow-md transition-all"
                      >
                        {uploadLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload &amp; Save Asset</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Assets Grid */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Stored Media Assets ({mediaAssets.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-ak-surface/80 border border-ak-line rounded-none p-4 flex gap-4 items-center"
                    >
                      <div className="w-20 h-20 bg-ak-ink border border-ak-line rounded-none overflow-hidden shrink-0 relative flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.filename}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = '0.3';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">{asset.filename}</p>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase shrink-0 ${
                              asset.url.startsWith('http')
                                ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                                : 'bg-ak-surface-2 text-ak-muted'
                            }`}
                          >
                            {asset.url.startsWith('http') ? 'External URL' : 'Local File'}
                          </span>
                        </div>
                        <p className="text-[10px] text-ak-muted font-mono truncate">{asset.url}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(asset.url)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-ak-surface-2 hover:bg-ak-surface-2 text-white text-[11px] font-semibold transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedUrl === asset.url ? 'Copied!' : 'Copy URL'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMediaItem(asset.id)}
                            className="p-1 rounded text-ak-muted hover:text-ak-accent-light transition-colors"
                            title="Delete asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 16: BLOG ARTICLES */}
          {activeTab === 'blog' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    Articles &amp; Blog Posts
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Publish fitness guides, lifting tutorials, and nutrition advice.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newPost: BlogPostItem = {
                      id: `blog-${Date.now()}`,
                      slug: `article-${Date.now()}`,
                      title: 'New Fitness Guide',
                      excerpt: 'Short excerpt summarizing the article.',
                      content: '# Article Headline\n\nWrite your guide content here...',
                      coverImage: '/images/hero_gorkhali_gym.jpg',
                      author: 'Gorkhali Gym Editorial',
                      category: 'Training',
                      readTime: '3 min read',
                      isPublished: false,
                      publishedAt: null,
                    };
                    saveBlogPostItem(newPost);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Article</span>
                </button>
              </div>

              <div className="space-y-4">
                {blog.map((post) => (
                  <div
                    key={post.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-ak-line pb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) => {
                            const updated = { ...post, title: e.target.value };
                            setBlog(blog.map((b) => (b.id === post.id ? updated : b)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-base font-bold text-white w-72"
                        />
                        <span className="text-xs font-mono text-ak-muted">/{post.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...post, isPublished: !post.isPublished };
                            saveBlogPostItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            post.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => deleteBlogPostItem(post.id)}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                        Excerpt
                      </label>
                      <textarea
                        rows={2}
                        value={post.excerpt}
                        onChange={(e) => {
                          const updated = { ...post, excerpt: e.target.value };
                          setBlog(blog.map((b) => (b.id === post.id ? updated : b)));
                        }}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-ak-muted mb-1">
                        Markdown Article Content
                      </label>
                      <textarea
                        rows={5}
                        value={post.content}
                        onChange={(e) => {
                          const updated = { ...post, content: e.target.value };
                          setBlog(blog.map((b) => (b.id === post.id ? updated : b)));
                        }}
                        className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveBlogPostItem(post)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Article</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 17: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                    FAQ Knowledge Base
                  </h2>
                  <p className="text-xs text-ak-muted">
                    Frequently asked questions, location answers, and training policies.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newFaq: FaqItem = {
                      id: `faq-${Date.now()}`,
                      question: 'New Question?',
                      answer: 'Clear, helpful answer for members.',
                      category: 'General',
                      displayOrder: faqs.length + 1,
                      isPublished: true,
                    };
                    saveFaqItem(newFaq);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-ak-surface/80 border border-ak-line rounded-none p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-ak-accent">#{faq.displayOrder}</span>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = { ...faq, question: e.target.value };
                            setFaqs(faqs.map((f) => (f.id === faq.id ? updated : f)));
                          }}
                          className="bg-ak-ink border border-ak-line rounded-none px-3 py-1.5 text-sm font-bold text-white w-72 sm:w-96"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...faq, isPublished: !faq.isPublished };
                            saveFaqItem(updated);
                          }}
                          className={`px-3 py-1 rounded-none text-xs font-bold uppercase transition-colors ${
                            faq.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-ak-surface-2 text-ak-muted'
                          }`}
                        >
                          {faq.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteFaqItem(faq.id)}
                          className="p-1.5 rounded-none bg-ak-ink text-ak-muted hover:text-ak-accent-light border border-ak-line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = { ...faq, answer: e.target.value };
                        setFaqs(faqs.map((f) => (f.id === faq.id ? updated : f)));
                      }}
                      className="w-full bg-ak-ink border border-ak-line rounded-none p-3 text-xs text-white"
                    />

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => saveFaqItem(faq)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-none bg-ak-surface-2 hover:bg-ak-surface-2 text-white font-bold text-xs uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 18: SECURITY & ADMINISTRATORS */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-display text-white uppercase tracking-tight">
                  Administrator Security &amp; Access Control
                </h2>
                <p className="text-xs text-ak-muted">
                  Manage administrator credentials, session revocation, and multi-user roles.
                </p>
              </div>

              {/* Password Change Card */}
              <div className="bg-ak-surface/80 border border-ak-line rounded-none p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-ak-accent" />
                  <span>Change Current Password</span>
                </h3>

                {pwFeedback && (
                  <div className="p-3 rounded-none bg-ak-ink border border-ak-line text-xs text-white">
                    {pwFeedback}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                      New Password (Minimum 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-ak-accent hover:bg-ak-accent-light text-white font-bold text-xs uppercase"
                  >
                    <span>Update Password</span>
                  </button>
                </form>
              </div>

              {/* Multi-Admin Provisioning (Superadmin Only) */}
              {adminUser?.role === 'superadmin' && (
                <div className="bg-ak-surface/80 border border-ak-line rounded-none p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Create Additional Administrator</span>
                  </h3>

                  {createAdminFeedback && (
                    <div className="p-3 rounded-none bg-ak-ink border border-ak-line text-xs text-white">
                      {createAdminFeedback}
                    </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-ak-muted mb-1">
                        Password (Min 8 characters)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-ak-muted mb-1">Role</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as 'superadmin' | 'admin')}
                        className="w-full bg-ak-ink border border-ak-line rounded-none px-4 py-2 text-sm text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Account</span>
                    </button>
                  </form>

                  {adminUsersList.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-ak-muted mb-2">
                        Existing Administrators ({adminUsersList.length})
                      </h4>
                      <div className="border border-ak-line rounded-none overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-ak-ink/60 text-ak-muted uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="text-left font-bold px-3 py-2">Username</th>
                              <th className="text-left font-bold px-3 py-2">Name</th>
                              <th className="text-left font-bold px-3 py-2">Role</th>
                              <th className="text-left font-bold px-3 py-2">Created</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ak-line">
                            {adminUsersList.map((a) => (
                              <tr key={a.id} className="hover:bg-ak-ink/40">
                                <td className="px-3 py-2 font-mono text-white">{a.username}</td>
                                <td className="px-3 py-2 text-ak-muted">{a.name}</td>
                                <td className="px-3 py-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                      a.role === 'superadmin'
                                        ? 'bg-ak-accent/10 text-ak-accent border border-ak-accent/40'
                                        : 'bg-ak-surface-2 text-ak-muted border border-ak-line'
                                    }`}
                                  >
                                    {a.role}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-ak-muted">
                                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={confirmMessage !== null}
        message={confirmMessage || ''}
        danger
        confirmLabel="Delete"
        onConfirm={() => resolveConfirm(true)}
        onCancel={() => resolveConfirm(false)}
      />
    </div>
  );
}
