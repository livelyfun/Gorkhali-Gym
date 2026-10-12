'use client';

import React, { useState, useEffect } from 'react';
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
  Edit3,
  Save,
  Check,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Copy,
  Upload,
  Search,
  Filter,
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
} from '@/lib/data-store';

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
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('gorkhagym');
  const [loginPassword, setLoginPassword] = useState('gymgorkha');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // CMS State
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sections, setSections] = useState<PageSectionItem[]>([]);
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

  // File upload state for Media Library
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        fetchAllCmsData();
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

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
        fetchAllCmsData();
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

  const fetchAllCmsData = async () => {
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
      ] = await Promise.all([
        fetch('/api/cms/dashboard'),
        fetch('/api/cms/settings'),
        fetch('/api/cms/sections'),
        fetch('/api/cms/navigation'),
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
      ]);

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

      // If user is superadmin, fetch admins list
      if (adminUser?.role === 'superadmin') {
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteSectionItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page section?')) return;
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteProgramItem = async (id: string, category: 'training' | 'service') => {
    if (!confirm('Are you sure you want to delete this program?')) return;
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteMembershipItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership plan?')) return;
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
      }
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteOfferItem = async (id: string) => {
    if (!confirm('Delete this promotional offer?')) return;
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteEventItem = async (id: string) => {
    if (!confirm('Delete this event?')) return;
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteTrainerItem = async (id: string) => {
    if (!confirm('Delete this trainer profile?')) return;
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteReviewItem = async (id: string) => {
    if (!confirm('Delete this review?')) return;
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteBlogPostItem = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
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
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteFaqItem = async (id: string) => {
    if (!confirm('Delete this FAQ entry?')) return;
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
    if (!confirm('Delete this navigation link?')) return;
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
    if (!confirm('Delete this gallery photo?')) return;
    try {
      await fetch(`/api/cms/gallery?id=${id}`, { method: 'DELETE' });
      setGallery((prev) => prev.filter((g) => g.id !== id));
      triggerFeedback('Gallery photo deleted');
    } catch {
      triggerFeedback('Failed to delete gallery item');
    }
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
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;
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
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
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

  const deleteMediaItem = async (id: string) => {
    if (!confirm('Delete this media asset from library?')) return;
    try {
      const res = await fetch(`/api/cms/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMediaAssets((prev) => prev.filter((m) => m.id !== id));
        triggerFeedback('Media asset removed');
      } else {
        alert(data.error || 'Cannot delete this asset');
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

  // --- LOADING SCREEN ---
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-neutral-400 font-mono text-sm uppercase tracking-wider">
          Verifying Administrator Session...
        </p>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-500 mb-4 shadow-xl">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Gorkhali Gym CMS
          </h2>
          <p className="mt-2 text-xs text-neutral-400 uppercase tracking-widest font-mono">
            Authorized Personnel &bull; Dharan Road, Itahari
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-neutral-900/90 border border-neutral-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
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
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
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

  return (
    <div className="min-h-screen bg-[#0A0D14] text-neutral-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 bg-[#0E121B] border-b border-neutral-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-base shadow-md">
            GK
          </div>
          <div>
            <h1 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>Gorkhali Gym CMS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono uppercase">
                {adminUser?.role || 'Admin'}
              </span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-medium">Itahari &bull; Koshi Province</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <div className="text-xs bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{saveStatus}</span>
            </div>
          )}

          <button
            onClick={() => fetchAllCmsData()}
            disabled={loadingData}
            title="Refresh all CMS data"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:text-white text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-red-400' : ''}`} />
          </button>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-xs font-bold text-red-300 hover:bg-red-900/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#0E121B] border-r border-neutral-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'inquiries'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 shrink-0" />
                <span>Inquiries & Leads</span>
              </div>
              {inquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {inquiries.filter((i) => i.status === 'new').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Business & Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'sections'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Page & Sections</span>
            </button>

            <button
              onClick={() => setActiveTab('navigation')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'navigation'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Navigation & Footer</span>
            </button>

            <button
              onClick={() => setActiveTab('announcement')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'announcement'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Announcement Bar</span>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Core Offerings
            </div>

            <button
              onClick={() => setActiveTab('programs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'programs'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Dumbbell className="w-4 h-4 shrink-0" />
              <span>Training Programs</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'services'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>General Services</span>
            </button>

            <button
              onClick={() => setActiveTab('memberships')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'memberships'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Memberships & Referral</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'offers'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Tag className="w-4 h-4 shrink-0" />
              <span>Offers & Promos</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'events'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Events & Clinics</span>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Community & Media
            </div>

            <button
              onClick={() => setActiveTab('trainers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'trainers'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Trainers & Coaches</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'reviews'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 shrink-0" />
                <span>Reviews & Moderation</span>
              </div>
              {reviews.filter((r) => !r.isPublished).length > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {reviews.filter((r) => !r.isPublished).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'gallery'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Facility Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'media'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>Media Library</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'blog'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Articles & Blog</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'faqs'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>FAQ Knowledge Base</span>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Security
            </div>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'security'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Security & Admins</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    CMS Overview &amp; Real Metrics
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Live counts directly computed from stored database records.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dashboardStats?.systemStatus?.vercelBlobConfigured ? 'bg-emerald-500' : 'bg-neutral-500'
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
                  className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl hover:border-red-600/50 cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    New Inquiries
                  </span>
                  <div className="text-3xl font-black text-red-500 mt-1">
                    {inquiries.filter((i) => i.status === 'new').length}
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    {inquiries.length} total applications
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('reviews')}
                  className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl hover:border-amber-600/50 cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Pending Reviews
                  </span>
                  <div className="text-3xl font-black text-amber-500 mt-1">
                    {reviews.filter((r) => !r.isPublished).length}
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    {reviews.filter((r) => r.isPublished).length} published live
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('offers')}
                  className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl hover:border-neutral-700 cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Active Offers
                  </span>
                  <div className="text-3xl font-black text-white mt-1">
                    {offers.filter((o) => o.isPublished).length}
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    {offers.length} configured promos
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('programs')}
                  className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl hover:border-neutral-700 cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Training &amp; Services
                  </span>
                  <div className="text-3xl font-black text-white mt-1">
                    {programs.filter((p) => p.isPublished).length +
                      services.filter((s) => s.isPublished).length}
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    {programs.length} training &bull; {services.length} services
                  </span>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  onClick={() => setActiveTab('trainers')}
                  className="bg-neutral-900/40 border border-neutral-800/80 p-3 rounded-xl cursor-pointer hover:bg-neutral-900"
                >
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Published Coaches</span>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {trainers.filter((t) => t.isPublished).length}
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('blog')}
                  className="bg-neutral-900/40 border border-neutral-800/80 p-3 rounded-xl cursor-pointer hover:bg-neutral-900"
                >
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Blog Articles</span>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {blog.filter((b) => b.isPublished).length}{' '}
                    <span className="text-xs text-neutral-500 font-normal">
                      ({blog.filter((b) => !b.isPublished).length} drafts)
                    </span>
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('gallery')}
                  className="bg-neutral-900/40 border border-neutral-800/80 p-3 rounded-xl cursor-pointer hover:bg-neutral-900"
                >
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Gallery Photos</span>
                  <p className="text-xl font-bold text-white mt-0.5">{gallery.length}</p>
                </div>
                <div
                  onClick={() => setActiveTab('media')}
                  className="bg-neutral-900/40 border border-neutral-800/80 p-3 rounded-xl cursor-pointer hover:bg-neutral-900"
                >
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Media Library</span>
                  <p className="text-xl font-bold text-white mt-0.5">{mediaAssets.length} assets</p>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Incoming Inquiries (Recent)
                  </h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold"
                  >
                    View All {inquiries.length} Inquiries &rarr;
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-4">No inquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                          <th className="py-2">Ref Code</th>
                          <th className="py-2">Applicant</th>
                          <th className="py-2">Phone / Contact</th>
                          <th className="py-2">Goal / Program</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {inquiries.slice(0, 5).map((inq) => (
                          <tr key={inq.id} className="hover:bg-neutral-900/50">
                            <td className="py-2.5 font-mono font-bold text-red-400">{inq.referenceCode}</td>
                            <td className="py-2.5 font-semibold text-white">{inq.fullName}</td>
                            <td className="py-2.5 text-neutral-300">{inq.phone}</td>
                            <td className="py-2.5 capitalize text-neutral-400">
                              {inq.program || inq.goal}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  inq.status === 'new'
                                    ? 'bg-red-950 text-red-300 border border-red-800'
                                    : inq.status === 'contacted'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : inq.status === 'enrolled'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-neutral-800 text-neutral-400'
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Inquiries &amp; Membership Leads
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Review and update lead pipeline with direct WhatsApp outreach and administrative notes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search name, phone, ref..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 w-48 sm:w-64"
                    />
                  </div>
                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
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
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-500">
                  <Inbox className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                  <p className="text-sm font-semibold">No inquiries matching filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-red-500">
                            {inq.referenceCode}
                          </span>
                          <span className="text-base font-bold text-white">{inq.fullName}</span>
                          <span className="text-xs text-neutral-400">{inq.phone}</span>
                          {inq.email && <span className="text-xs text-neutral-500">({inq.email})</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              updateInquiryStatus(inq.id, e.target.value as InquiryItem['status'])
                            }
                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs font-bold uppercase focus:outline-none focus:border-red-600"
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
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={() => deleteInquiryItem(inq.id)}
                            className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:text-red-400 text-neutral-500 transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px] font-bold">
                            Goal / Target
                          </span>
                          <span className="text-neutral-200 capitalize font-medium">{inq.goal}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px] font-bold">
                            Program / Offer
                          </span>
                          <span className="text-neutral-200 font-medium">
                            {inq.program || inq.selectedOffer || 'General Admission'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px] font-bold">
                            Preferred Time &bull; Date
                          </span>
                          <span className="text-neutral-200 capitalize font-medium">
                            {inq.preferredTime || 'Anytime'} &bull;{' '}
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {inq.message && (
                        <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60 text-xs text-neutral-300">
                          <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
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
                          className="flex-1 bg-neutral-950 border border-neutral-800/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Business Settings &amp; Branding
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Official gym details, colors, contacts, and SEO settings synchronized across the site.
                  </p>
                </div>
                <button
                  onClick={saveSettings}
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Gym Legal / Brand Name
                    </label>
                    <input
                      type="text"
                      value={settings.gymName}
                      onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Contact Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail || ''}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value || null })}
                      placeholder="info@gorkhaligym.com"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      WhatsApp Number (International format)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Physical Street Address
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Daily Opening Hours
                    </label>
                    <input
                      type="text"
                      value={settings.openingHours}
                      onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={settings.mapUrl}
                    onChange={(e) => setSettings({ ...settings, mapUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 font-mono text-xs"
                  />
                </div>

                {/* Theme Colors & Logos */}
                <div className="pt-4 border-t border-neutral-800/80">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                    Visual Branding &amp; Colors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded border border-neutral-700 bg-neutral-950 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Secondary Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded border border-neutral-700 bg-neutral-950 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Dark Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.darkBackground}
                          onChange={(e) => setSettings({ ...settings, darkBackground: e.target.value })}
                          className="w-10 h-10 rounded border border-neutral-700 bg-neutral-950 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.darkBackground}
                          onChange={(e) => setSettings({ ...settings, darkBackground: e.target.value })}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        Custom Logo URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="/images/logo.png or https://..."
                        value={settings.logoUrl || ''}
                        onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value || null })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        Favicon URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="/favicon.ico or https://..."
                        value={settings.faviconUrl || ''}
                        onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value || null })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-neutral-800/80">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                    Social Media Profiles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settings.facebookUrl}
                        onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={settings.instagramUrl}
                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">TikTok URL</label>
                      <input
                        type="url"
                        value={settings.tiktokUrl}
                        onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer and SEO */}
                <div className="pt-4 border-t border-neutral-800/80">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                    Footer &amp; Global SEO Metadata
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Footer Description
                      </label>
                      <textarea
                        rows={2}
                        value={settings.footerDescription}
                        onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Copyright Text</label>
                      <input
                        type="text"
                        value={settings.copyrightText}
                        onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Default Meta Title</label>
                      <input
                        type="text"
                        value={settings.metaTitle}
                        onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Default Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={settings.metaDescription}
                        onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Page &amp; Section Editor
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Edit homepage headlines, body copy, images, CTAs, and toggle or reorder sections.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newSec: PageSectionItem = {
                      id: `sec-${Date.now()}`,
                      pageSlug: 'home',
                      sectionKey: `custom-${Date.now()}`,
                      heading: 'New Section Headline',
                      subheading: 'Subtitle description',
                      bodyText: 'Body paragraph text for this section.',
                      imageUrl: '/images/hero_gorkhali_gym.jpg',
                      ctaLabel: 'Learn More',
                      ctaUrl: '/training',
                      displayOrder: sections.length + 1,
                      isVisible: true,
                    };
                    saveSectionItem(newSec);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-4">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-500">#{sec.displayOrder}</span>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
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
                              const prev = sections[idx - 1];
                              const current = sections[idx];
                              saveSectionItem({ ...current, displayOrder: prev.displayOrder });
                              saveSectionItem({ ...prev, displayOrder: current.displayOrder });
                            }}
                            className="p-1.5 rounded-lg bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-30 border border-neutral-800"
                            title="Move section up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === sections.length - 1}
                            onClick={() => {
                              if (idx === sections.length - 1) return;
                              const next = sections[idx + 1];
                              const current = sections[idx];
                              saveSectionItem({ ...current, displayOrder: next.displayOrder });
                              saveSectionItem({ ...next, displayOrder: current.displayOrder });
                            }}
                            className="p-1.5 rounded-lg bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-30 border border-neutral-800"
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
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            sec.isVisible
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {sec.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteSectionItem(sec.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => {
                            const updated = { ...sec, heading: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Subheading
                        </label>
                        <input
                          type="text"
                          value={sec.subheading || ''}
                          onChange={(e) => {
                            const updated = { ...sec, subheading: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Body Text
                      </label>
                      <textarea
                        rows={2}
                        value={sec.bodyText || ''}
                        onChange={(e) => {
                          const updated = { ...sec, bodyText: e.target.value };
                          setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Background Image URL
                        </label>
                        <input
                          type="text"
                          value={sec.imageUrl || ''}
                          onChange={(e) => {
                            const updated = { ...sec, imageUrl: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          CTA Button Label
                        </label>
                        <input
                          type="text"
                          value={sec.ctaLabel || ''}
                          onChange={(e) => {
                            const updated = { ...sec, ctaLabel: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          CTA Destination URL
                        </label>
                        <input
                          type="text"
                          value={sec.ctaUrl || ''}
                          onChange={(e) => {
                            const updated = { ...sec, ctaUrl: e.target.value };
                            setSections(sections.map((s) => (s.id === sec.id ? updated : s)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveSectionItem(sec)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Navigation &amp; Footer Manager
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Navigation Link</span>
                </button>
              </div>

              <div className="space-y-4">
                {navigation.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-red-500">#{item.displayOrder}</span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = { ...item, label: e.target.value };
                            setNavigation(navigation.map((n) => (n.id === item.id ? updated : n)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm font-bold text-white w-48"
                        />
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const updated = { ...item, href: e.target.value };
                            setNavigation(navigation.map((n) => (n.id === item.id ? updated : n)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 font-mono w-48"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...item, isPublished: !item.isPublished };
                            saveNavigationItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            item.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {item.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => saveNavigationItem(item)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-300 hover:text-white border border-neutral-800"
                          title="Save link"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNavigationItem(item.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-400 hover:text-red-500 border border-neutral-800"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Nested Children (if any) */}
                    {item.children && item.children.length > 0 && (
                      <div className="pl-6 border-l-2 border-neutral-800 space-y-2 pt-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                          Dropdown Children:
                        </span>
                        {item.children.map((child, cIdx) => (
                          <div key={child.id || cIdx} className="flex items-center gap-2 text-xs">
                            <span className="text-neutral-500">&bull;</span>
                            <span className="font-semibold text-white">{child.label}</span>
                            <span className="text-neutral-500 font-mono text-[11px]">({child.href})</span>
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Announcement Banner
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Top alert strip for promotions, holiday hours, or urgent notices.
                  </p>
                </div>
                <button
                  onClick={saveAnnouncement}
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving...' : 'Save & Publish'}</span>
                </button>
              </div>

              {/* Real-time Live Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Live Banner Preview:
                </span>
                <div className="h-9 min-h-[36px] max-h-[36px] bg-red-950/95 border border-red-800/40 text-red-100 px-4 text-xs font-medium rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                  <div className="flex items-center justify-center gap-2 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{announcement.text}</span>
                    {announcement.linkUrl && (
                      <span className="underline text-white font-bold ml-1.5 whitespace-nowrap">
                        {announcement.linkLabel || 'Details →'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <label className="text-sm font-bold text-white uppercase tracking-wider">
                      Banner Status
                    </label>
                    <p className="text-xs text-neutral-400">
                      When enabled, displays at the very top of the public website.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnnouncement({ ...announcement, isActive: !announcement.isActive })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors ${
                      announcement.isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {announcement.isActive ? 'Active (Enabled)' : 'Disabled'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Announcement Text
                  </label>
                  <textarea
                    rows={2}
                    value={announcement.text}
                    onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Link Destination URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="/apply or /offers"
                      value={announcement.linkUrl || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value || null })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Link Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Join Now or View Offer →"
                      value={announcement.linkLabel || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, linkLabel: e.target.value || null })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
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
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
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
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Training Programs
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Training Program</span>
                </button>
              </div>

              <div className="space-y-4">
                {programs.map((prog) => (
                  <div
                    key={prog.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-red-500">#{prog.displayOrder}</span>
                        <input
                          type="text"
                          value={prog.title}
                          onChange={(e) => {
                            const updated = { ...prog, title: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                        <span className="text-xs font-mono text-neutral-400">slug: /{prog.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...prog, isPublished: !prog.isPublished };
                            saveProgramItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            prog.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {prog.isPublished ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => deleteProgramItem(prog.id, 'training')}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={prog.shortDesc}
                          onChange={(e) => {
                            const updated = { ...prog, shortDesc: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Full Description
                        </label>
                        <textarea
                          rows={2}
                          value={prog.fullDesc}
                          onChange={(e) => {
                            const updated = { ...prog, fullDesc: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={prog.imageUrl}
                          onChange={(e) => {
                            const updated = { ...prog, imageUrl: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={prog.duration || ''}
                          onChange={(e) => {
                            const updated = { ...prog, duration: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Badge (e.g. Popular)
                        </label>
                        <input
                          type="text"
                          value={prog.badge || ''}
                          onChange={(e) => {
                            const updated = { ...prog, badge: e.target.value };
                            setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveProgramItem(prog)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    General Services
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="space-y-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-red-500">#{srv.displayOrder}</span>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const updated = { ...srv, title: e.target.value };
                            setServices(services.map((s) => (s.id === s.id ? updated : s)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                        <span className="text-xs font-mono text-neutral-400">slug: /{srv.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...srv, isPublished: !srv.isPublished };
                            saveProgramItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            srv.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {srv.isPublished ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => deleteProgramItem(srv.id, 'service')}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={srv.shortDesc}
                          onChange={(e) => {
                            const updated = { ...srv, shortDesc: e.target.value };
                            setServices(services.map((s) => (s.id === srv.id ? updated : s)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Full Description
                        </label>
                        <textarea
                          rows={2}
                          value={srv.fullDesc}
                          onChange={(e) => {
                            const updated = { ...srv, fullDesc: e.target.value };
                            setServices(services.map((s) => (s.id === srv.id ? updated : s)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveProgramItem(srv)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      Membership Plans
                    </h2>
                    <p className="text-xs text-neutral-400">
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Plan</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {memberships.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-red-500">#{plan.displayOrder}</span>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const updated = { ...plan, name: e.target.value };
                              setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                            }}
                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-base font-bold text-white w-64"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = { ...plan, isPublished: !plan.isPublished };
                              saveMembershipItem(updated);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                              plan.isPublished
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {plan.isPublished ? 'Published' : 'Unpublished'}
                          </button>
                          <button
                            onClick={() => deleteMembershipItem(plan.id)}
                            className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                            Pricing Notice (Unconfirmed rates remain inquiry-based)
                          </label>
                          <input
                            type="text"
                            value={plan.priceInfo || ''}
                            onChange={(e) => {
                              const updated = { ...plan, priceInfo: e.target.value };
                              setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                            Duration / Period
                          </label>
                          <input
                            type="text"
                            value={plan.period || ''}
                            onChange={(e) => {
                              const updated = { ...plan, period: e.target.value };
                              setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={plan.description}
                          onChange={(e) => {
                            const updated = { ...plan, description: e.target.value };
                            setMemberships(memberships.map((m) => (m.id === plan.id ? updated : m)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => saveMembershipItem(plan)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 pt-6">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        Referral Program Settings
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Rules, benefits, and active state for the Refer-a-Friend promotion.
                      </p>
                    </div>
                    <button
                      onClick={() => setReferral({ ...referral, isActive: !referral.isActive })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${
                        referral.isActive
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {referral.isActive ? 'Program Active' : 'Program Inactive'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                      Program Title
                    </label>
                    <input
                      type="text"
                      value={referral.title}
                      onChange={(e) => setReferral({ ...referral, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                      Benefit Description
                    </label>
                    <textarea
                      rows={2}
                      value={referral.benefitText}
                      onChange={(e) => setReferral({ ...referral, benefitText: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                      Terms &amp; Eligibility Rules
                    </label>
                    <textarea
                      rows={3}
                      value={referral.rules}
                      onChange={(e) => setReferral({ ...referral, rules: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={saveReferralItem}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Promotional Offers
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Offer</span>
                </button>
              </div>

              <div className="space-y-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-red-500">#{offer.displayOrder}</span>
                        <input
                          type="text"
                          value={offer.title}
                          onChange={(e) => {
                            const updated = { ...offer, title: e.target.value };
                            setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                        <span className="text-xs font-mono text-neutral-400">/{offer.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...offer, isPublished: !offer.isPublished };
                            saveOfferItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            offer.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {offer.isPublished ? 'Published' : 'Unpublished'}
                        </button>
                        <button
                          onClick={() => deleteOfferItem(offer.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Badge (e.g. Limited Offer)
                        </label>
                        <input
                          type="text"
                          value={offer.badge || ''}
                          onChange={(e) => {
                            const updated = { ...offer, badge: e.target.value };
                            setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Discount / Benefit Details
                        </label>
                        <input
                          type="text"
                          value={offer.discountInfo || ''}
                          onChange={(e) => {
                            const updated = { ...offer, discountInfo: e.target.value };
                            setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
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
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={offer.shortDesc}
                        onChange={(e) => {
                          const updated = { ...offer, shortDesc: e.target.value };
                          setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveOfferItem(offer)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Events, Seminars &amp; Clinics
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-red-500">#{evt.displayOrder}</span>
                        <input
                          type="text"
                          value={evt.title}
                          onChange={(e) => {
                            const updated = { ...evt, title: e.target.value };
                            setEvents(events.map((eItem) => (eItem.id === evt.id ? updated : eItem)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-base font-bold text-white w-64"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...evt, isPublished: !evt.isPublished };
                            saveEventItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            evt.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {evt.isPublished ? 'Published' : 'Unpublished'}
                        </button>
                        <button
                          onClick={() => deleteEventItem(evt.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
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
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Location Venue
                        </label>
                        <input
                          type="text"
                          value={evt.location}
                          onChange={(e) => {
                            const updated = { ...evt, location: e.target.value };
                            setEvents(events.map((eItem) => (eItem.id === evt.id ? updated : eItem)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Full Description
                      </label>
                      <textarea
                        rows={2}
                        value={evt.fullDesc}
                        onChange={(e) => {
                          const updated = { ...evt, fullDesc: e.target.value };
                          setEvents(events.map((eItem) => (eItem.id === evt.id ? updated : eItem)));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveEventItem(evt)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Trainers &amp; Staff Profiles
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trainer</span>
                </button>
              </div>

              <div className="space-y-4">
                {trainers.map((tr) => (
                  <div
                    key={tr.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-red-500">#{tr.displayOrder}</span>
                        <input
                          type="text"
                          value={tr.name}
                          onChange={(e) => {
                            const updated = { ...tr, name: e.target.value };
                            setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-base font-bold text-white w-60"
                        />
                        <input
                          type="text"
                          placeholder="Role / Title"
                          value={tr.role}
                          onChange={(e) => {
                            const updated = { ...tr, role: e.target.value };
                            setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 w-52"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...tr, isPublished: !tr.isPublished };
                            saveTrainerItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            tr.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {tr.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteTrainerItem(tr.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Biography
                      </label>
                      <textarea
                        rows={2}
                        value={tr.bio}
                        onChange={(e) => {
                          const updated = { ...tr, bio: e.target.value };
                          setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
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
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Profile Photo URL
                        </label>
                        <input
                          type="text"
                          value={tr.imageUrl || ''}
                          onChange={(e) => {
                            const updated = { ...tr, imageUrl: e.target.value };
                            setTrainers(trainers.map((t) => (t.id === tr.id ? updated : t)));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveTrainerItem(tr)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Member Reviews &amp; Moderation
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Public submissions require moderator approval before appearing on the live website.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                      reviewFilter === 'all' ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    All ({reviews.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                      reviewFilter === 'pending'
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Pending ({reviews.filter((r) => !r.isPublished).length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('published')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                      reviewFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Approved ({reviews.filter((r) => r.isPublished).length})
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-500">
                    <Star className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                    <p className="text-sm font-semibold">No reviews matching filter.</p>
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-sm">{rev.author}</span>
                          <span className="text-amber-400 font-bold text-xs flex items-center">
                            {'★'.repeat(rev.rating)}
                            <span className="text-neutral-600 text-xs ml-1">({rev.rating}/5)</span>
                          </span>
                          <span className="text-neutral-500 text-xs">
                            {new Date(rev.reviewDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {rev.isPublished ? (
                            <button
                              onClick={() => saveReviewModeration(rev, false)}
                              className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              onClick={() => saveReviewModeration(rev, true)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase shadow-sm"
                            >
                              Approve &amp; Publish
                            </button>
                          )}
                          <button
                            onClick={() => deleteReviewItem(rev.id)}
                            className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed">{rev.fullText}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 14: FACILITY GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Facility Gallery Photos
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Photos of the barbell floor, racks, coaching, and amenities.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newGal: GalleryItem = {
                      id: `gal-${Date.now()}`,
                      title: 'New Gym Photo',
                      caption: 'Facility deck view.',
                      orientation: 'landscape',
                      category: 'training',
                      imageUrl: '/images/hero_gorkhali_gym.jpg',
                      displayOrder: gallery.length + 1,
                      isPublished: true,
                    };
                    saveGalleryItem(newGal);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">#{g.displayOrder} {g.title}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...g, isPublished: !g.isPublished };
                            saveGalleryItem(updated);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            g.isPublished ? 'bg-emerald-950 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {g.isPublished ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteGalleryItem(g.id)}
                          className="p-1 text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={g.imageUrl}
                      onChange={(e) => {
                        const updated = { ...g, imageUrl: e.target.value };
                        setGallery(gallery.map((item) => (item.id === g.id ? updated : item)));
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />

                    <input
                      type="text"
                      placeholder="Caption"
                      value={g.caption || ''}
                      onChange={(e) => {
                        const updated = { ...g, caption: e.target.value };
                        setGallery(gallery.map((item) => (item.id === g.id ? updated : item)));
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-300"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={() => saveGalleryItem(g)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 15: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Media Library &amp; Asset Storage
                </h2>
                <p className="text-xs text-neutral-400">
                  Upload files directly to persistent cloud storage (Vercel Blob), manage metadata, and reuse asset URLs.
                </p>
              </div>

              {/* Upload Card */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-red-500" />
                  <span>Upload New Media File</span>
                </h3>

                {uploadError && (
                  <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Select File
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-neutral-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Alternative Text (SEO)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Olympic squat rack floor"
                        value={uploadAlt}
                        onChange={(e) => setUploadAlt(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Caption (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Free-weight area"
                        value={uploadCaption}
                        onChange={(e) => setUploadCaption(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={uploadLoading || !uploadFile}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase shadow-md transition-all"
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
                      className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex gap-4 items-center"
                    >
                      <div className="w-20 h-20 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center">
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs font-bold text-white truncate">{asset.filename}</p>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">{asset.url}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => copyToClipboard(asset.url)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedUrl === asset.url ? 'Copied!' : 'Copy URL'}</span>
                          </button>
                          <button
                            onClick={() => deleteMediaItem(asset.id)}
                            className="p-1 rounded text-neutral-500 hover:text-red-400"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Articles &amp; Blog Posts
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Article</span>
                </button>
              </div>

              <div className="space-y-4">
                {blog.map((post) => (
                  <div
                    key={post.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) => {
                            const updated = { ...post, title: e.target.value };
                            setBlog(blog.map((b) => (b.id === post.id ? updated : b)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-base font-bold text-white w-72"
                        />
                        <span className="text-xs font-mono text-neutral-400">/{post.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...post, isPublished: !post.isPublished };
                            saveBlogPostItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            post.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => deleteBlogPostItem(post.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Excerpt
                      </label>
                      <textarea
                        rows={2}
                        value={post.excerpt}
                        onChange={(e) => {
                          const updated = { ...post, excerpt: e.target.value };
                          setBlog(blog.map((b) => (b.id === post.id ? updated : b)));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Markdown Article Content
                      </label>
                      <textarea
                        rows={5}
                        value={post.content}
                        onChange={(e) => {
                          const updated = { ...post, content: e.target.value };
                          setBlog(blog.map((b) => (b.id === post.id ? updated : b)));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => saveBlogPostItem(post)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    FAQ Knowledge Base
                  </h2>
                  <p className="text-xs text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-500">#{faq.displayOrder}</span>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = { ...faq, question: e.target.value };
                            setFaqs(faqs.map((f) => (f.id === faq.id ? updated : f)));
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm font-bold text-white w-72 sm:w-96"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = { ...faq, isPublished: !faq.isPublished };
                            saveFaqItem(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                            faq.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {faq.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteFaqItem(faq.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 text-neutral-500 hover:text-red-400 border border-neutral-800"
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
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                    />

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => saveFaqItem(faq)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase"
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
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Administrator Security &amp; Access Control
                </h2>
                <p className="text-xs text-neutral-400">
                  Manage administrator credentials, session revocation, and multi-user roles.
                </p>
              </div>

              {/* Password Change Card */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-500" />
                  <span>Change Current Password</span>
                </h3>

                {pwFeedback && (
                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                    {pwFeedback}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                      New Password (Minimum 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                  >
                    <span>Update Password</span>
                  </button>
                </form>
              </div>

              {/* Multi-Admin Provisioning (Superadmin Only) */}
              {adminUser?.role === 'superadmin' && (
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Create Additional Administrator</span>
                  </h3>

                  {createAdminFeedback && (
                    <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                      {createAdminFeedback}
                    </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Password (Min 8 characters)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Role</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as 'superadmin' | 'admin')}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Account</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
