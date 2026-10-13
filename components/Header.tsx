'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { store, SiteSettings, Announcement } from '@/lib/data-store';

interface HeaderProps {
  initialSettings?: SiteSettings;
  initialAnnouncement?: Announcement;
  onOpenApplyModal?: () => void;
}

export default function Header({
  initialSettings,
  initialAnnouncement,
  onOpenApplyModal,
}: HeaderProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || store.getSettings());
  const [announcement, setAnnouncement] = useState<Announcement>(
    initialAnnouncement || store.getAnnouncement()
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname() || '';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/cms/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    fetch('/api/cms/announcement')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcement) setAnnouncement(data.announcement);
      })
      .catch(() => {});
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navLink = (active: boolean) =>
    `ak-focus ak-link transition-colors whitespace-nowrap ${
      active ? 'text-ak-accent' : 'text-neutral-300 hover:text-white'
    }`;

  const dropdownLink =
    'block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-ak-accent/15 border-l-2 border-transparent hover:border-ak-accent transition-colors';
  const dropdownAll =
    'block px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-ak-accent hover:text-white hover:bg-ak-accent/20 border-l-2 border-ak-accent transition-colors';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-ak-ink/95 backdrop-blur-md border-b border-ak-line'
          : 'bg-gradient-to-b from-ak-ink via-ak-ink/85 to-transparent'
      }`}
    >
      {/* Announcement Banner */}
      {announcement.isActive && (
        <div className="relative bg-ak-ink border-b border-ak-line overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-ak-accent skew-x-[-18deg] -translate-x-1/2" />
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center text-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-ak-accent shrink-0" />
            <span className="truncate text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-300">
              {announcement.text}
            </span>
            {announcement.linkUrl && (
              <Link
                href={announcement.linkUrl}
                className="ak-focus underline decoration-ak-accent decoration-2 underline-offset-2 hover:text-white font-extrabold ml-1.5 whitespace-nowrap shrink-0 text-[11px] uppercase tracking-[0.18em] text-ak-accent transition-colors"
              >
                {announcement.linkLabel || 'Details →'}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Logo */}
          <Link href="/" className="ak-focus flex items-center gap-2 group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.logoUrl || '/logo.png'}
              alt={`${settings.gymName} Logo`}
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-extrabold uppercase tracking-[0.16em] font-display">
            <Link href="/" className={navLink(pathname === '/')}>
              Home
            </Link>

            {/* Training Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('training')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`ak-focus ak-link flex items-center gap-1.5 transition-colors py-2 whitespace-nowrap ${
                  pathname.startsWith('/training')
                    ? 'text-ak-accent'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <span>Training</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'training' && (
                <div className="absolute top-full left-0 w-60 py-2 ak-panel ak-cut-tr shadow-2xl z-50">
                  <Link href="/training/personal-training" className={dropdownLink}>
                    Personal Training
                  </Link>
                  <Link href="/training/strength-training" className={dropdownLink}>
                    Strength Training
                  </Link>
                  <Link href="/training/yoga-class" className={dropdownLink}>
                    Yoga Class
                  </Link>
                  <div className="my-1 border-t border-ak-line" />
                  <Link href="/training" className={dropdownAll}>
                    Browse All Training →
                  </Link>
                </div>
              )}
            </div>

            {/* Membership Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('membership')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`ak-focus ak-link flex items-center gap-1.5 transition-colors py-2 whitespace-nowrap ${
                  pathname.startsWith('/membership')
                    ? 'text-ak-accent'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <span>Membership</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'membership' && (
                <div className="absolute top-full left-0 w-56 py-2 ak-panel ak-cut-tr shadow-2xl z-50">
                  <Link href="/membership/club" className={dropdownLink}>
                    Club Membership
                  </Link>
                  <Link href="/membership/refer-a-friend" className={dropdownLink}>
                    Refer a Friend
                  </Link>
                  <div className="my-1 border-t border-ak-line" />
                  <Link href="/membership" className={dropdownAll}>
                    Membership Overview →
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`ak-focus ak-link flex items-center gap-1.5 transition-colors py-2 whitespace-nowrap ${
                  pathname.startsWith('/services')
                    ? 'text-ak-accent'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 w-56 py-2 ak-panel ak-cut-tr shadow-2xl z-50">
                  <Link href="/services/nutritionist" className={dropdownLink}>
                    Nutritionist Consultation
                  </Link>
                  <div className="my-1 border-t border-ak-line" />
                  <Link href="/services" className={dropdownAll}>
                    All Services →
                  </Link>
                </div>
              )}
            </div>

            {/* Explore Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('explore')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`ak-focus ak-link flex items-center gap-1.5 transition-colors py-2 whitespace-nowrap ${
                  pathname.startsWith('/gallery') ||
                  pathname.startsWith('/blog') ||
                  pathname.startsWith('/events') ||
                  pathname.startsWith('/offers') ||
                  pathname.startsWith('/faq') ||
                  pathname.startsWith('/reviews') ||
                  pathname.startsWith('/about') ||
                  pathname.startsWith('/team')
                    ? 'text-ak-accent'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <span>Explore</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'explore' && (
                <div className="absolute top-full left-0 w-52 py-2 ak-panel ak-cut-tr shadow-2xl grid grid-cols-1 divide-y divide-ak-line z-50">
                  <div className="py-1">
                    <Link href="/gallery" className={dropdownLink}>
                      Gallery
                    </Link>
                    <Link href="/blog" className={dropdownLink}>
                      Blog
                    </Link>
                    <Link href="/events" className={dropdownLink}>
                      Events
                    </Link>
                    <Link href="/offers" className={dropdownLink}>
                      Offers
                    </Link>
                  </div>
                  <div className="py-1">
                    <Link href="/faq" className={dropdownLink}>
                      FAQ
                    </Link>
                    <Link href="/reviews" className={dropdownLink}>
                      Reviews
                    </Link>
                    <Link href="/about" className={dropdownLink}>
                      About Us
                    </Link>
                    <Link href="/team" className={dropdownLink}>
                      Our Team
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/contact" className={navLink(pathname === '/contact')}>
              Contact
            </Link>
          </nav>

          {/* Zone 3: Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenApplyModal ? (
              <button
                type="button"
                onClick={onOpenApplyModal}
                className="ak-btn ak-btn-primary hidden sm:inline-flex"
              >
                <span>{settings.applyButtonLabel || 'Apply Now'}</span>
              </button>
            ) : (
              <Link
                href="/apply"
                className="ak-btn ak-btn-primary hidden sm:inline-flex"
              >
                <span>{settings.applyButtonLabel || 'Apply Now'}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ak-focus lg:hidden p-2.5 border border-ak-line bg-ak-surface text-neutral-300 hover:text-white hover:border-ak-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ak-ink border-b border-ak-line px-6 py-6 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="flex flex-col gap-4 text-sm font-extrabold uppercase tracking-[0.14em] font-display">
            <Link
              href="/"
              className={`ak-focus py-2 border-b border-ak-line ${
                pathname === '/' ? 'text-ak-accent' : 'text-neutral-300'
              }`}
            >
              Home
            </Link>

            <div className="py-2 border-b border-ak-line">
              <button
                type="button"
                onClick={() => toggleDropdown('m-training')}
                className="ak-focus flex items-center justify-between w-full text-neutral-300 py-1 hover:text-white"
              >
                <span>Training</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-training' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-training' && (
                <div className="pl-4 pt-2 flex flex-col gap-2 text-xs normal-case tracking-normal text-neutral-400">
                  <Link href="/training/personal-training" className="py-1 hover:text-white">
                    Personal Training
                  </Link>
                  <Link href="/training/strength-training" className="py-1 hover:text-white">
                    Strength Training
                  </Link>
                  <Link href="/training/yoga-class" className="py-1 hover:text-white">
                    Yoga Class
                  </Link>
                  <Link href="/training" className="py-1 font-extrabold text-ak-accent">
                    Browse All Training →
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2 border-b border-ak-line">
              <button
                type="button"
                onClick={() => toggleDropdown('m-membership')}
                className="ak-focus flex items-center justify-between w-full text-neutral-300 py-1 hover:text-white"
              >
                <span>Membership</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-membership' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-membership' && (
                <div className="pl-4 pt-2 flex flex-col gap-2 text-xs normal-case tracking-normal text-neutral-400">
                  <Link href="/membership/club" className="py-1 hover:text-white">
                    Club Membership
                  </Link>
                  <Link href="/membership/refer-a-friend" className="py-1 hover:text-white">
                    Refer a Friend
                  </Link>
                  <Link href="/membership" className="py-1 font-extrabold text-ak-accent">
                    Membership Overview →
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2 border-b border-ak-line">
              <button
                type="button"
                onClick={() => toggleDropdown('m-services')}
                className="ak-focus flex items-center justify-between w-full text-neutral-300 py-1 hover:text-white"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-services' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-services' && (
                <div className="pl-4 pt-2 flex flex-col gap-2 text-xs normal-case tracking-normal text-neutral-400">
                  <Link href="/services/nutritionist" className="py-1 hover:text-white">
                    Nutritionist Consultation
                  </Link>
                  <Link href="/services" className="py-1 font-extrabold text-ak-accent">
                    All Services →
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2 border-b border-ak-line">
              <button
                type="button"
                onClick={() => toggleDropdown('m-explore')}
                className="ak-focus flex items-center justify-between w-full text-neutral-300 py-1 hover:text-white"
              >
                <span>Explore</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-explore' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-explore' && (
                <div className="pl-4 pt-2 grid grid-cols-2 gap-2 text-xs normal-case tracking-normal text-neutral-400">
                  <Link href="/gallery" className="py-1 hover:text-white">
                    Gallery
                  </Link>
                  <Link href="/blog" className="py-1 hover:text-white">
                    Blog
                  </Link>
                  <Link href="/events" className="py-1 hover:text-white">
                    Events
                  </Link>
                  <Link href="/offers" className="py-1 hover:text-white">
                    Offers
                  </Link>
                  <Link href="/faq" className="py-1 hover:text-white">
                    FAQ
                  </Link>
                  <Link href="/reviews" className="py-1 hover:text-white">
                    Reviews
                  </Link>
                  <Link href="/about" className="py-1 hover:text-white">
                    About
                  </Link>
                  <Link href="/team" className="py-1 hover:text-white">
                    Our Team
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`ak-focus py-2 border-b border-ak-line ${
                pathname === '/contact' ? 'text-ak-accent' : 'text-neutral-300'
              }`}
            >
              Contact
            </Link>

            <div className="pt-2 flex flex-col gap-3">
              <Link href="/apply" className="ak-btn ak-btn-primary w-full justify-center">
                <span>Apply for Membership</span>
              </Link>
              <div className="flex items-center justify-between text-[11px] normal-case tracking-normal text-neutral-400 pt-3 border-t border-ak-line">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="ak-focus flex items-center gap-1.5 hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-ak-accent" />
                  <span>{settings.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ak-focus flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
