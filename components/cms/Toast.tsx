'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  message: string | null;
  variant?: ToastVariant;
  onClose?: () => void;
}

function inferVariant(message: string): ToastVariant {
  if (/error|failed|fail\b|unable|cannot|invalid|denied/i.test(message)) return 'error';
  if (/deleted|removed/i.test(message)) return 'info';
  return 'success';
}

const STYLES: Record<ToastVariant, { wrap: string; icon: React.ReactNode }> = {
  success: {
    wrap: 'bg-emerald-950/90 border-emerald-700/60 text-emerald-200',
    icon: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
  },
  error: {
    wrap: 'bg-ak-accent/10 border-ak-accent/40 text-white',
    icon: <AlertCircle className="w-4 h-4 text-ak-accent shrink-0" />,
  },
  info: {
    wrap: 'bg-ak-surface-2 border-ak-line text-white',
    icon: <Info className="w-4 h-4 text-ak-muted shrink-0" />,
  },
};

export default function Toast({ message, variant, onClose }: ToastProps) {
  if (!message) return null;
  const v = variant ?? inferVariant(message);
  const s = STYLES[v];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-20 right-4 z-50 max-w-sm text-xs px-3 py-2 rounded-none border flex items-center gap-2 shadow-2xl backdrop-blur-sm ${s.wrap}`}
    >
      {s.icon}
      <span className="leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-1 p-0.5 rounded-none hover:bg-black/20 transition-colors ak-focus"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
