'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  Award,
  Flame,
} from 'lucide-react';
import type { NavigationItemType } from '@/lib/data-store';
import { useCms } from '@/components/cms/CmsProvider';

interface FooterProps {
  onOpenApplyModal?: () => void;
}

export default function Footer({ onOpenApplyModal }: FooterProps) {
  const { data } = useCms();
  const settings = data.settings;
  const programs = data.programs ?? [];
  const footerNav: NavigationItemType[] = useMemo(
    () =>
      (data.navigation ?? []).filter(
        (n) => n.location === 'footer' && n.isPublished !== false
      ),
    [data.navigation]
  );

  const footerColumns = useMemo(() => {
    const groups = new Map<string, NavigationItemType[]>();
    for (const item of footerNav) {
      const column = item.footerColumn?.trim();
      if (!column) continue;
      if (!groups.has(column)) groups.set(column, []);
      groups.get(column)!.push(item);
    }
    return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
  }, [footerNav]);

  const footerUtility = useMemo(
    () => footerNav.filter((n) => !n.footerColumn?.trim()),
    [footerNav]
  );

  const gridColsClass =
    ['lg:grid-cols-4', 'lg:grid-cols-5', 'lg:grid-cols-6', 'lg:grid-cols-7'][
      Math.min(footerColumns.length, 3)
    ] || 'lg:grid-cols-5';

  const columnTitle =
    'ak-heading text-xs text-white tracking-[0.18em] mb-4 flex items-center gap-2';
  const footLink = 'ak-focus transition-colors hover:text-ak-accent';

  if (!settings) return null;

  return (
    <footer className="ak-page text-neutral-300 border-t border-ak-line">
      {/* Top Banner / Call to Action Strip */}
      <div className="relative bg-ak-surface border-b border-ak-line overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 ak-stripe opacity-60 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ak-accent flex items-center justify-center text-white shrink-0 skew-x-[-8deg]">
              <Flame className="w-6 h-6 -skew-x-[-8deg]" />
            </div>
            <div>
              <h3 className="ak-heading text-xl sm:text-2xl text-white">
                Ready to unleash your Gorkhali strength?
              </h3>
              <p className="text-sm text-ak-muted mt-1">
                Join Itahari&apos;s most disciplined and empowering fitness family today.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={onOpenApplyModal} className="ak-btn ak-btn-primary flex-1 md:flex-initial">
              <span>
                {settings.applyButtonLabel || 'Apply Now'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Gorkhali%20Gym%2C%20I%20would%20like%20to%20inquire%20about%20membership!`}
              target="_blank"
              rel="noopener noreferrer"
              className="ak-focus inline-flex items-center justify-center p-3 bg-ak-ink border border-ak-line text-emerald-400 hover:border-emerald-500 hover:text-emerald-300 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-10`}>
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="ak-focus inline-flex items-center gap-3 group">
              <div className="w-11 h-11 bg-ak-accent flex items-center justify-center text-white font-black text-xl group-hover:scale-105 transition-transform skew-x-[-8deg]">
                <Dumbbell className="w-5 h-5 -skew-x-[-8deg]" />
              </div>
              <div className="flex flex-col">
                <span className="ak-heading text-xl text-white">{settings.gymName}</span>
                <span className="text-[10px] tracking-[0.2em] text-ak-accent uppercase font-bold">
                  Strength &bull; Discipline &bull; Community
                </span>
              </div>
            </Link>
            <p className="text-sm text-ak-muted leading-relaxed pr-6">
              {settings.footerDescription ||
                'Premier fitness facility in Itahari, Koshi Province, Nepal. Dedicated to authentic strength training, conditioning, body transformation, and lifelong health.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ak-ink border border-ak-line text-[11px] uppercase tracking-wider text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Certified Coaches</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ak-ink border border-ak-line text-[11px] uppercase tracking-wider text-neutral-400">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Modern Equipment</span>
              </span>
            </div>
          </div>

          {/* Programs & Services */}
          <div>
            <h4 className={columnTitle}>
              <span className="w-5 h-0.5 bg-ak-accent skew-x-[-30deg]" />
              Programs &amp; Training
            </h4>
            <ul className="space-y-2.5 text-sm text-ak-muted">
              {programs.slice(0, 5).map((program) => {
                const href = program.category === 'service' ? `/services/${program.slug}` : `/training/${program.slug}`;
                return (
                  <li key={program.id}>
                    <Link href={href} className={footLink}>
                      {program.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/training"
                  className="ak-focus text-ak-accent hover:text-white font-bold uppercase tracking-wider text-xs inline-flex items-center gap-1 pt-1 transition-colors"
                >
                  <span>View All Programs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer link columns (from Navigation CMS) */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className={columnTitle}>
                <span className="w-5 h-0.5 bg-ak-accent skew-x-[-30deg]" />
                {column.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-ak-muted">
                {column.items.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className={footLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Visit & Connect */}
          <div>
            <h4 className={columnTitle}>
              <span className="w-5 h-0.5 bg-ak-accent skew-x-[-30deg]" />
              Visit Itahari Gym
            </h4>
            <div className="space-y-3 text-sm text-ak-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ak-accent shrink-0 mt-0.5" />
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ak-focus hover:text-neutral-200 transition-colors leading-snug"
                >
                  {settings.address}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-ak-accent shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="ak-focus hover:text-white font-medium"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-ak-accent shrink-0 mt-0.5" />
                <span className="text-xs text-ak-muted">{settings.openingHours}</span>
              </div>
              <div className="pt-2 flex items-center gap-3">
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-9 h-9 bg-ak-ink border border-ak-line flex items-center justify-center text-neutral-400 hover:text-white hover:border-ak-accent transition-colors"
                    title="Facebook"
                  >
                    <span className="font-bold text-xs">fb</span>
                  </a>
                )}
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-9 h-9 bg-ak-ink border border-ak-line flex items-center justify-center text-neutral-400 hover:text-white hover:border-ak-accent transition-colors"
                    title="Instagram"
                  >
                    <span className="font-bold text-xs">ig</span>
                  </a>
                )}
                {settings.tiktokUrl && (
                  <a
                    href={settings.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ak-focus w-9 h-9 bg-ak-ink border border-ak-line flex items-center justify-center text-neutral-400 hover:text-white hover:border-ak-accent transition-colors"
                    title="TikTok"
                  >
                    <span className="font-bold text-xs">tt</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer & Copyright & Subtle Admin Link */}
      <div className="border-t border-ak-line bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {settings.gymName}.{' '}
            {settings.copyrightText || 'All rights reserved. Itahari, Koshi Province, Nepal.'}
          </p>
          <div className="flex items-center gap-6 uppercase tracking-wider">
            {footerUtility.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="ak-focus hover:text-ak-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/gorkhali-gym-management"
              className="ak-focus text-neutral-600 hover:text-ak-accent transition-colors flex items-center gap-1"
            >
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
