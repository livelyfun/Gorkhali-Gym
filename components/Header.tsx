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
import { store, SiteSettings, Announcement, NavigationItemType } from '@/lib/data-store';

interface HeaderProps {
  initialSettings?: SiteSettings;
  initialAnnouncement?: Announcement;
  initialNavigation?: NavigationItemType[];
  onOpenApplyModal?: () => void;
}

export default function Header({
  initialSettings,
  initialAnnouncement,
  initialNavigation,
  onOpenApplyModal,
}: HeaderProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || store.getSettings());
  const [announcement, setAnnouncement] = useState<Announcement>(
    initialAnnouncement || store.getAnnouncement()
  );
  const [navigation, setNavigation] = useState<NavigationItemType[]>(
    initialNavigation || store.getNavigation()
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

    fetch('/api/cms/navigation')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.navigation) && data.navigation.length > 0) {
          setNavigation(data.navigation);
        }
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

  const publishedChildren = (item: NavigationItemType): NavigationItemType[] =>
    (item.children || []).filter((c) => c.isPublished !== false);

  const headerNav = navigation.filter((item) => item.location !== 'footer');

  const isItemActive = (item: NavigationItemType): boolean => {
    if (item.href === '/') return pathname === '/';
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
    return publishedChildren(item).some(
      (c) => c.href !== '/' && (pathname === c.href || pathname.startsWith(`${c.href}/`))
    );
  };

  const isChildAll = (label: string) => label.trim().endsWith('→');

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
            {headerNav.map((item) => {
              const children = publishedChildren(item);
              const active = isItemActive(item);

              if (children.length === 0) {
                return (
                  <Link key={item.id} href={item.href} className={navLink(active)}>
                    {item.label}
                  </Link>
                );
              }

              const allChild = children.find((c) => isChildAll(c.label));
              const regular = children.filter((c) => c !== allChild);
              const twoColumn = regular.length > 5;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    className={`ak-focus ak-link flex items-center gap-1.5 transition-colors py-2 whitespace-nowrap ${
                      active ? 'text-ak-accent' : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 opacity-75" />
                  </button>
                  {activeDropdown === item.id && (
                    <div
                      className={`absolute top-full left-0 py-2 ak-panel ak-cut-tr shadow-2xl z-50 ${
                        twoColumn ? 'w-[22rem]' : 'w-56'
                      }`}
                    >
                      {twoColumn ? (
                        <div className="grid grid-cols-2 divide-x divide-ak-line">
                          {regular.map((child) => (
                            <Link key={child.id} href={child.href} className={dropdownLink}>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        regular.map((child) => (
                          <Link key={child.id} href={child.href} className={dropdownLink}>
                            {child.label}
                          </Link>
                        ))
                      )}
                      {allChild && (
                        <>
                          <div className="my-1 border-t border-ak-line" />
                          <Link href={allChild.href} className={dropdownAll}>
                            {allChild.label}
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
            {headerNav.map((item) => {
              const children = publishedChildren(item);
              const active = isItemActive(item);

              if (children.length === 0) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`ak-focus py-2 border-b border-ak-line ${
                      active ? 'text-ak-accent' : 'text-neutral-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              const twoColumn = children.length > 5;

              return (
                <div key={item.id} className="py-2 border-b border-ak-line">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(`m-${item.id}`)}
                    className={`ak-focus flex items-center justify-between w-full py-1 ${
                      active ? 'text-ak-accent' : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeDropdown === `m-${item.id}` ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === `m-${item.id}` && (
                    <div
                      className={`pl-4 pt-2 text-xs normal-case tracking-normal text-neutral-400 ${
                        twoColumn ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'
                      }`}
                    >
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={`py-1 ${
                            isChildAll(child.label)
                              ? 'font-extrabold text-ak-accent'
                              : 'hover:text-white'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2 flex flex-col gap-3">
              <Link href="/apply" className="ak-btn ak-btn-primary w-full justify-center">
                <span>{settings.applyButtonLabel || 'Apply Now'}</span>
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
