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
import { store } from '@/lib/data-store';

export default function ContactPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Membership Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settings = store.getSettings();

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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onOpenApplyModal={() => setApplyModalOpen(true)} />

      <section className="relative pt-36 sm:pt-40 pb-16 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Get in Touch &bull; Itahari Gym
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
              Contact Gorkhali Gym
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
              We welcome you to visit our facility in person or reach out through direct WhatsApp and phone call.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Details & Info */}
            <div className="space-y-8">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6">
                <h2 className="text-2xl font-black uppercase text-white">Official Information</h2>

                <div className="space-y-5 text-sm text-neutral-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
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
                        className="inline-flex items-center space-x-1 text-xs text-red-500 hover:text-red-400 font-bold mt-2"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold uppercase text-xs tracking-wider">
                        Phone / WhatsApp
                      </strong>
                      <a
                        href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                        className="mt-1 text-white hover:text-red-400 font-semibold block text-base"
                      >
                        {settings.phone}
                      </a>
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Gorkhali%20Gym!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp Directly</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
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

                <div className="pt-4 border-t border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                    Official Social Channels:
                  </span>
                  <div className="flex items-center space-x-3">
                    {settings.facebookUrl && (
                      <a
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-red-500 text-xs font-bold text-neutral-300 hover:text-white transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {settings.instagramUrl && (
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-red-500 text-xs font-bold text-neutral-300 hover:text-white transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {settings.tiktokUrl && (
                      <a
                        href={settings.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-red-500 text-xs font-bold text-neutral-300 hover:text-white transition-colors"
                      >
                        TikTok
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase">Message Sent!</h3>
                  <p className="text-neutral-300 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{name}</strong>. Our front desk coach will contact you via WhatsApp / phone shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">Send Direct Message</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Have questions about packages, coaching or timings? We respond promptly.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anish Gurung"
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +977 982-XXXXXXX"
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Topic / Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                    >
                      <option value="General Membership Inquiry">General Membership Inquiry</option>
                      <option value="Personal Training Consultation">Personal Training Consultation</option>
                      <option value="Corporate / Group Package">Corporate / Group Package</option>
                      <option value="Facility Tour Booking">Facility Tour Booking</option>
                      <option value="Feedback or Question">Feedback or Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your inquiry or question here..."
                      className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message to Gorkhali Gym</span>
                        </>
                      )}
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
