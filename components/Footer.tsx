'use client';

import React from 'react';
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
import { store, SiteSettings } from '@/lib/data-store';

interface FooterProps {
  settings?: SiteSettings;
  onOpenApplyModal?: () => void;
}

export default function Footer({ settings: initialSettings, onOpenApplyModal }: FooterProps) {
  const settings = initialSettings || store.getSettings();

  const columnTitle =
    'ak-heading text-xs text-white tracking-[0.18em] mb-4 flex items-center gap-2';
  const footLink = 'ak-focus transition-colors hover:text-ak-accent';

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
                Apply for Membership
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
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
              <li>
                <Link href="/training/strength-conditioning" className={footLink}>
                  Strength &amp; Conditioning
                </Link>
              </li>
              <li>
                <Link href="/training/personal-training" className={footLink}>
                  Personal Training (1-on-1)
                </Link>
              </li>
              <li>
                <Link href="/training/weight-loss-transformation" className={footLink}>
                  Weight Loss &amp; Fat Burn
                </Link>
              </li>
              <li>
                <Link href="/services/yoga-mobility" className={footLink}>
                  Yoga &amp; Athletic Mobility
                </Link>
              </li>
              <li>
                <Link href="/services/nutrition-diet-consulting" className={footLink}>
                  Nutrition Consultation
                </Link>
              </li>
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

          {/* Membership & Gym Life */}
          <div>
            <h4 className={columnTitle}>
              <span className="w-5 h-0.5 bg-ak-accent skew-x-[-30deg]" />
              Membership &amp; Club
            </h4>
            <ul className="space-y-2.5 text-sm text-ak-muted">
              <li>
                <Link href="/membership" className={footLink}>
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/membership/club" className={footLink}>
                  Club Membership &amp; Rules
                </Link>
              </li>
              <li>
                <Link href="/membership/refer-a-friend" className={footLink}>
                  Refer a Friend Program
                </Link>
              </li>
              <li>
                <Link href="/offers" className={footLink}>
                  Promotions &amp; Deals
                </Link>
              </li>
              <li>
                <Link href="/events" className={footLink}>
                  Gym Events &amp; Challenges
                </Link>
              </li>
              <li>
                <Link href="/reviews" className={footLink}>
                  Member Reviews &amp; Ratings
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={footLink}>
                  Photo &amp; Facility Gallery
                </Link>
              </li>
            </ul>
          </div>

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
            <Link href="/about" className="ak-focus hover:text-ak-accent transition-colors">
              About Us
            </Link>
            <Link href="/team" className="ak-focus hover:text-ak-accent transition-colors">
              Trainers
            </Link>
            <Link href="/faq" className="ak-focus hover:text-ak-accent transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="ak-focus hover:text-ak-accent transition-colors">
              Contact
            </Link>
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
