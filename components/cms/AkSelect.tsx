'use client';

import React from 'react';

interface AkSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export default function AkSelect({ className = '', options, placeholder, ...rest }: AkSelectProps) {
  return (
    <select
      className={`w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-sm text-white focus:outline-none focus:border-ak-accent transition-colors ak-focus ${className}`}
      {...rest}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}