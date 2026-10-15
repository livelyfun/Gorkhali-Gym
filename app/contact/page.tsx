'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import PageHero from '@/components/PageHero';
import { useCms } from '@/components/cms/CmsProvider';

export default function ContactPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Membership Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settings = useCms().data.settings;

  if (!settings) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          phone,
          program: subject,
          preferredTime: 'Flexible',
          message,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Error sending message. Please try again or reach out directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ak-ink text-white flex flex-col">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-ak-surface border-b border-ak-line">
        <div className="absolute inset-0 ak-stripe opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            pageSlug="contact"
            fallback={{
              eyebrow: 'Get in Touch • Itahari Gym',
              heading: 'Contact Gorkhali Gym',
              body: 'We welcome you to visit our facility in person or reach out through direct WhatsApp and phone call.',
            }}
          />
        </div>
      </section>

      <section className="py-24 bg-ak-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Details & Info */}
            <div className="space-y-8">
              <div className="ak-panel ak-cut-tr p-8 space-y-6">
                <h2 className="font-display text-2xl text-white">Official Information</h2>

                <div className="space-y-5 text-sm text-neutral-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold uppercase text-xs tracking-wider">
                        Physical Address
                      </strong>
                      <p className="mt-1 leading-relaxed text-neutral-300">{settings.address}</p>
                      <a
                        href={settings.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ak-focus inline-flex items-center space-x-1 text-xs text-ak-accent hover:text-white font-bold mt-2"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold uppercase text-xs tracking-wider">
                        Phone / WhatsApp
                      </strong>
                      <a
                        href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                        className="ak-focus mt-1 text-white hover:text-ak-accent font-semibold block text-base"
                      >
                        {settings.phone}
                      </a>
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Gorkhali%20Gym!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ak-focus inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp Directly</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-ak-accent/20 text-ak-accent flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold uppercase text-xs tracking-wider">
                        Gym Hours
                      </strong>
                      <p className="mt-1 leading-relaxed text-neutral-300">{settings.openingHours}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-ak-line">
                  <span className="text-xs font-bold uppercase tracking-wider text-ak-muted block mb-3">
                    Official Social Channels:
                  </span>
                  <div className="flex items-center space-x-3">
                    {settings.facebookUrl && (
                      <a
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ak-focus px-4 py-2 bg-ak-ink border border-ak-line hover:border-ak-accent text-xs font-bold text-neutral-300 hover:text-white transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {settings.instagramUrl && (
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ak-focus px-4 py-2 bg-ak-ink border border-ak-line hover:border-ak-accent text-xs font-bold text-neutral-300 hover:text-white transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {settings.tiktokUrl && (
                      <a
                        href={settings.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ak-focus px-4 py-2 bg-ak-ink border border-ak-line hover:border-ak-accent text-xs font-bold text-neutral-300 hover:text-white transition-colors"
                      >
                        TikTok
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="ak-panel ak-cut-tr p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-2xl text-white">Message Sent!</h3>
                  <p className="text-neutral-300 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{name}</strong>. Our front desk coach will contact you via WhatsApp / phone shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="ak-btn ak-btn-outline mt-4"
                  >
                    <span>Send Another Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl text-white">Send Direct Message</h3>
                    <p className="text-xs text-ak-muted mt-1">
                      Have questions about packages, coaching or timings? We respond promptly.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 border-l-2 border-ak-accent bg-red-950/60 text-red-300 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anish Gurung"
                      className="ak-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +977 982-XXXXXXX"
                      className="ak-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Topic / Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="ak-input"
                    >
                      <option value="General Membership Inquiry">General Membership Inquiry</option>
                      <option value="Personal Training Consultation">Personal Training Consultation</option>
                      <option value="Corporate / Group Package">Corporate / Group Package</option>
                      <option value="Facility Tour Booking">Facility Tour Booking</option>
                      <option value="Feedback or Question">Feedback or Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-[0.14em] mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your inquiry or question here..."
                      className="ak-input resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="ak-btn ak-btn-primary w-full"
                    >
                      <span>
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message to Gorkhali Gym</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenApplyModal={() => setApplyModalOpen(true)} />
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
