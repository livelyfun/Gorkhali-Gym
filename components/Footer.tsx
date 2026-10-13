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

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      {/* Top Banner / Call to Action Strip */}
      <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 border-b border-orange-600/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-600/40 flex items-center justify-center text-orange-600">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                Ready to unleash your Gorkhali strength?
              </h3>
              <p className="text-sm text-neutral-400">
                Join Itahari&apos;s most disciplined and empowering fitness family today.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={onOpenApplyModal}
              className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold text-sm bg-orange-600 hover:bg-orange-600 text-white shadow-lg shadow-red-600/30 transition-all uppercase tracking-wider"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Gorkhali%20Gym%2C%20I%20would%20like%20to%20inquire%20about%20membership!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
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
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider text-xl text-white uppercase">
                  {settings.gymName}
                </span>
                <span className="text-[10px] tracking-widest text-orange-600 uppercase font-semibold">
                  Strength &bull; Discipline &bull; Community
                </span>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed pr-6">
              {settings.footerDescription ||
                'Premier fitness facility in Itahari, Koshi Province, Nepal. Dedicated to authentic strength training, conditioning, body transformation, and lifelong health.'}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Certified Coaches</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Modern Equipment</span>
              </span>
            </div>
          </div>

          {/* Programs & Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-600 pl-2">
              Programs & Training
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/training/strength-conditioning" className="hover:text-orange-600 transition-colors">
                  Strength & Conditioning
                </Link>
              </li>
              <li>
                <Link href="/training/personal-training" className="hover:text-orange-600 transition-colors">
                  Personal Training (1-on-1)
                </Link>
              </li>
              <li>
                <Link href="/training/weight-loss-transformation" className="hover:text-orange-600 transition-colors">
                  Weight Loss & Fat Burn
                </Link>
              </li>
              <li>
                <Link href="/services/yoga-mobility" className="hover:text-orange-600 transition-colors">
                  Yoga & Athletic Mobility
                </Link>
              </li>
              <li>
                <Link href="/services/nutrition-diet-consulting" className="hover:text-orange-600 transition-colors">
                  Nutrition Consultation
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-orange-600 hover:text-orange-600 font-medium inline-flex items-center space-x-1">
                  <span>View All Programs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership & Gym Life */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-600 pl-2">
              Membership & Club
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/membership" className="hover:text-orange-600 transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/membership/club" className="hover:text-orange-600 transition-colors">
                  Club Membership & Rules
                </Link>
              </li>
              <li>
                <Link href="/membership/refer-a-friend" className="hover:text-orange-600 transition-colors">
                  Refer a Friend Program
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-orange-600 transition-colors">
                  Promotions & Deals
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-orange-600 transition-colors">
                  Gym Events & Challenges
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-orange-600 transition-colors">
                  Member Reviews & Ratings
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-orange-600 transition-colors">
                  Photo & Facility Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit & Connect */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-600 pl-2">
              Visit Itahari Gym
            </h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-200 transition-colors leading-snug"
                >
                  {settings.address}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white font-medium">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-400">
                  {settings.openingHours}
                </span>
              </div>
              <div className="pt-2 flex items-center space-x-3">
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-orange-600 transition-colors"
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
                    className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-orange-600 transition-colors"
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
                    className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-orange-600 transition-colors"
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
      <div className="border-t border-neutral-900 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {settings.gymName}. {settings.copyrightText || 'All rights reserved. Itahari, Koshi Province, Nepal.'}
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-neutral-400 transition-colors">
              About Us
            </Link>
            <Link href="/team" className="hover:text-neutral-400 transition-colors">
              Trainers
            </Link>
            <Link href="/faq" className="hover:text-neutral-400 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-neutral-400 transition-colors">
              Contact
            </Link>
            <Link
              href="/gorkhali-gym-management"
              className="text-neutral-600 hover:text-orange-600 transition-colors flex items-center space-x-1"
            >
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
