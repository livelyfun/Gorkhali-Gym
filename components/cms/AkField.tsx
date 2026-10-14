'use client';

import React from 'react';

interface AkFieldProps {
  label?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export default function AkField({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  className = '',
  children,
}: AkFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-[11px] font-bold text-neutral-300 uppercase tracking-[0.14em]"
        >
          {label}
          {required && <span className="text-ak-accent"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[11px] text-ak-accent leading-snug">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-ak-muted leading-snug">{hint}</p>
      ) : null}
    </div>
  );
}
