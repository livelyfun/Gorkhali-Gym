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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-[#0B0E14]/95 backdrop-blur-md shadow-xl border-b border-neutral-800/80'
          : 'bg-gradient-to-b from-[#0B0E14]/95 via-[#0B0E14]/80 to-transparent'
      }`}
    >
      {/* Announcement Banner (At very top: stays completely clear of dropdowns below and maintains consistent height) */}
      {announcement.isActive && (
        <div className="h-9 min-h-[36px] max-h-[36px] bg-red-950/95 border-b border-red-800/40 text-red-100 px-4 text-xs font-medium backdrop-blur-md flex items-center justify-center overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{announcement.text}</span>
            {announcement.linkUrl && (
              <Link
                href={announcement.linkUrl}
                className="underline hover:text-white font-bold ml-1.5 whitespace-nowrap shrink-0 transition-colors"
              >
                {announcement.linkLabel || 'Details →'}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-lg shadow-red-950/50 group-hover:bg-red-500 transition-colors">
              GK
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                {settings.gymName}
              </span>
              <span className="text-[11px] tracking-widest text-neutral-400 font-medium uppercase">
                Itahari · Nepal
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold tracking-wide">
            <Link
              href="/"
              className={`transition-colors hover:text-red-400 whitespace-nowrap ${
                pathname === '/' ? 'text-red-500' : 'text-neutral-200'
              }`}
            >
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
                className={`flex items-center gap-1.5 transition-colors hover:text-red-400 py-2 whitespace-nowrap ${
                  pathname.startsWith('/training') ? 'text-red-500' : 'text-neutral-200'
                }`}
              >
                <span>Training</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'training' && (
                <div className="absolute top-full left-0 w-60 py-2 bg-[#121620] border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-xl z-50">
                  <Link
                    href="/training/personal-training"
                    className="block px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                  >
                    Personal Training
                  </Link>
                  <Link
                    href="/training/strength-training"
                    className="block px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                  >
                    Strength Training
                  </Link>
                  <Link
                    href="/training/yoga-class"
                    className="block px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                  >
                    Yoga Class
                  </Link>
                  <div className="my-1 border-t border-neutral-800" />
                  <Link
                    href="/training"
                    className="block px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-600/20 transition-colors"
                  >
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
                className={`flex items-center gap-1.5 transition-colors hover:text-red-400 py-2 whitespace-nowrap ${
                  pathname.startsWith('/membership') ? 'text-red-500' : 'text-neutral-200'
                }`}
              >
                <span>Membership</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'membership' && (
                <div className="absolute top-full left-0 w-56 py-2 bg-[#121620] border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-xl z-50">
                  <Link
                    href="/membership/club"
                    className="block px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                  >
                    Club Membership
                  </Link>
                  <Link
                    href="/membership/refer-a-friend"
                    className="block px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                  >
                    Refer a Friend
                  </Link>
                  <div className="my-1 border-t border-neutral-800" />
                  <Link
                    href="/membership"
                    className="block px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-600/20 transition-colors"
                  >
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
                className={`flex items-center gap-1.5 transition-colors hover:text-red-400 py-2 whitespace-nowrap ${
                  pathname.startsWith('/services') ? 'text-red-500' : 'text-neutral-200'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 w-56 py-2 bg-[#121620] border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-xl z-50">
                  <Link
                    href="/services/nutritionist"
                    className="block px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                  >
                    Nutritionist Consultation
                  </Link>
                  <div className="my-1 border-t border-neutral-800" />
                  <Link
                    href="/services"
                    className="block px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-600/20 transition-colors"
                  >
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
                className={`flex items-center gap-1.5 transition-colors hover:text-red-400 py-2 whitespace-nowrap ${
                  pathname.startsWith('/gallery') ||
                  pathname.startsWith('/blog') ||
                  pathname.startsWith('/events') ||
                  pathname.startsWith('/offers') ||
                  pathname.startsWith('/faq') ||
                  pathname.startsWith('/reviews') ||
                  pathname.startsWith('/about') ||
                  pathname.startsWith('/team')
                    ? 'text-red-500'
                    : 'text-neutral-200'
                }`}
              >
                <span>Explore</span>
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === 'explore' && (
                <div className="absolute top-full left-0 w-52 py-2 bg-[#121620] border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-xl grid grid-cols-1 divide-y divide-neutral-800/40 z-50">
                  <div className="py-1">
                    <Link
                      href="/gallery"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      Gallery
                    </Link>
                    <Link
                      href="/blog"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      Blog
                    </Link>
                    <Link
                      href="/events"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      Events
                    </Link>
                    <Link
                      href="/offers"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      Offers
                    </Link>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/faq"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      FAQ
                    </Link>
                    <Link
                      href="/reviews"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      Reviews
                    </Link>
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/team"
                      className="block px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-red-600/20 transition-colors"
                    >
                      Our Team
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`transition-colors hover:text-red-400 whitespace-nowrap ${
                pathname === '/contact' ? 'text-red-500' : 'text-neutral-200'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Zone 3: Action Button */}
          <div className="flex items-center gap-4 shrink-0">
            {onOpenApplyModal ? (
              <button
                type="button"
                onClick={onOpenApplyModal}
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-lg shadow-red-950/40 whitespace-nowrap"
              >
                {settings.applyButtonLabel || 'Apply Now'}
              </button>
            ) : (
              <Link
                href="/apply"
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-lg shadow-red-950/40 whitespace-nowrap"
              >
                {settings.applyButtonLabel || 'Apply Now'}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F131B] border-b border-neutral-800 px-6 py-6 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="flex flex-col gap-4 text-base font-semibold">
            <Link
              href="/"
              className={`py-2 border-b border-neutral-800/60 ${
                pathname === '/' ? 'text-red-500' : 'text-neutral-200'
              }`}
            >
              Home
            </Link>

            <div className="py-2 border-b border-neutral-800/60">
              <button
                type="button"
                onClick={() => toggleDropdown('m-training')}
                className="flex items-center justify-between w-full text-neutral-200 py-1"
              >
                <span>Training</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-training' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-training' && (
                <div className="pl-4 pt-2 flex flex-col gap-2 text-sm text-neutral-400">
                  <Link href="/training/personal-training" className="py-1 hover:text-white">
                    Personal Training
                  </Link>
                  <Link href="/training/strength-training" className="py-1 hover:text-white">
                    Strength Training
                  </Link>
                  <Link href="/training/yoga-class" className="py-1 hover:text-white">
                    Yoga Class
                  </Link>
                  <Link href="/training" className="py-1 font-bold text-red-400">
                    Browse All Training →
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2 border-b border-neutral-800/60">
              <button
                type="button"
                onClick={() => toggleDropdown('m-membership')}
                className="flex items-center justify-between w-full text-neutral-200 py-1"
              >
                <span>Membership</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-membership' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-membership' && (
                <div className="pl-4 pt-2 flex flex-col gap-2 text-sm text-neutral-400">
                  <Link href="/membership/club" className="py-1 hover:text-white">
                    Club Membership
                  </Link>
                  <Link href="/membership/refer-a-friend" className="py-1 hover:text-white">
                    Refer a Friend
                  </Link>
                  <Link href="/membership" className="py-1 font-bold text-red-400">
                    Membership Overview →
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2 border-b border-neutral-800/60">
              <button
                type="button"
                onClick={() => toggleDropdown('m-services')}
                className="flex items-center justify-between w-full text-neutral-200 py-1"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-services' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-services' && (
                <div className="pl-4 pt-2 flex flex-col gap-2 text-sm text-neutral-400">
                  <Link href="/services/nutritionist" className="py-1 hover:text-white">
                    Nutritionist Consultation
                  </Link>
                  <Link href="/services" className="py-1 font-bold text-red-400">
                    All Services →
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2 border-b border-neutral-800/60">
              <button
                type="button"
                onClick={() => toggleDropdown('m-explore')}
                className="flex items-center justify-between w-full text-neutral-200 py-1"
              >
                <span>Explore</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'm-explore' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'm-explore' && (
                <div className="pl-4 pt-2 grid grid-cols-2 gap-2 text-sm text-neutral-400">
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
              className={`py-2 border-b border-neutral-800/60 ${
                pathname === '/contact' ? 'text-red-500' : 'text-neutral-200'
              }`}
            >
              Contact
            </Link>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/apply"
                className="w-full text-center py-3 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-950/40"
              >
                Apply for Membership
              </Link>
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  <span>{settings.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
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
