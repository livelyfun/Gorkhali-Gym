'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Facebook,
  Instagram,
} from 'lucide-react';
import type { SiteSettings } from '@/lib/data-store';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refCode, setRefCode] = useState<string | null>(null);

  const cleanPhone = settings.phone.replace(/\s+/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email: email || null,
          goal,
          message: message || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSuccess('Your message has been received! Our front desk will be in touch promptly.');
      setRefCode(data.referenceCode);
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="py-24 bg-[#0E1118] border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            VISIT OUR GYM OR SEND A MESSAGE
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            Located conveniently on Dharan Road, opposite Soaltee Westend Hotel in Itahari.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact Form */}
          <div className="rounded-2xl bg-[#121620] border border-neutral-800 p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Send an Inquiry</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Have questions about memberships, schedule, or coaching? Leave a note and we will call or text you back.
            </p>

            {success ? (
              <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-center flex flex-col items-center gap-3">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Inquiry Sent Successfully</h4>
                <p className="text-xs text-neutral-300">{success}</p>
                {refCode && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-neutral-900 px-3 py-1 rounded">
                    Reference Code: {refCode}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSuccess(null)}
                  className="mt-2 text-xs font-bold text-red-400 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                {error && (
                  <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+977 98..."
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Email Address <span className="text-neutral-500">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Inquiry Topic</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="general">General Membership Question</option>
                    <option value="personal-training">Personal Coaching Inquiry</option>
                    <option value="strength">Strength Training Setup</option>
                    <option value="yoga">Yoga Class Times</option>
                    <option value="nutrition">Nutritionist Booking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Your Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you would like to know..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Location Card & Official Details */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#121620] border border-neutral-800 p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Facility Information</h3>

              <div className="flex flex-col gap-5 text-sm">
                {/* Physical Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">
                      Physical Location
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {settings.address}
                    </p>
                    <a
                      href={settings.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-bold mt-1.5"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">
                      Operating Hours
                    </span>
                    <p className="text-xs text-neutral-300">
                      Open Daily: <span className="font-bold text-white">{settings.openingHours}</span>
                    </p>
                    <span className="text-[11px] text-neutral-500">
                      Morning & evening sessions available every day
                    </span>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">
                      Phone Contact
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-xs font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">
                      WhatsApp Messaging
                    </span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Chat with Front Desk: {settings.whatsapp}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Channels Strip */}
              <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-semibold mr-1">Follow:</span>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-red-600 flex items-center gap-1.5 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-red-600 flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-red-600 flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-[10px] font-mono font-bold">TT</span>
                  <span>TikTok</span>
                </a>
              </div>
            </div>

            {/* Google Maps Visual Embed / Location Pin Container */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl text-center flex flex-col items-center justify-center min-h-[160px]">
              <MapPin className="w-8 h-8 text-red-500 mb-2 animate-bounce" />
              <h4 className="text-sm font-bold text-white mb-1">
                Opposite Soaltee Westend Hotel
              </h4>
              <p className="text-xs text-neutral-400 mb-4 max-w-sm">
                Dharan Road, Itahari, Koshi Province 56705. Ample parking for two-wheelers and cars.
              </p>
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-950/40"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
