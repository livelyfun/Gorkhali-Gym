'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export type AkButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type AkButtonSize = 'sm' | 'md' | 'lg';

interface AkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AkButtonVariant;
  size?: AkButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANTS: Record<AkButtonVariant, string> = {
  primary:
    'bg-ak-accent text-white hover:bg-ak-accent-light border border-transparent shadow-lg shadow-ak-accent/20',
  secondary:
    'bg-ak-surface-2 text-white hover:bg-ak-surface border border-ak-line',
  danger:
    'bg-ak-accent/10 text-ak-accent hover:bg-ak-accent/20 border border-ak-accent/40',
  outline:
    'bg-transparent text-white hover:bg-ak-accent/10 border border-ak-line hover:border-ak-accent',
  ghost:
    'bg-transparent text-ak-muted hover:text-white hover:bg-ak-surface-2 border border-transparent',
};

const SIZES: Record<AkButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-[10px] gap-1.5',
  md: 'px-4 py-2 text-xs gap-2',
  lg: 'px-5 py-2.5 text-xs gap-2',
};

export default function AkButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  type = 'button',
  ...rest
}: AkButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-none font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed ak-focus ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}
