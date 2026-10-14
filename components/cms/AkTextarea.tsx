'use client';

import React from 'react';

interface AkTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export default function AkTextarea({ className = '', rows = 3, ...rest }: AkTextareaProps) {
  return (
    <textarea
      rows={rows}
      className={`w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-sm text-white placeholder:text-neutral-600 resize-y focus:outline-none focus:border-ak-accent transition-colors ak-focus ${className}`}
      {...rest}
    />
  );
}
