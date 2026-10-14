'use client';

import React from 'react';

interface AkToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function AkToggle({ checked, onChange, label, disabled = false, className = '' }: AkToggleProps) {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-none border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ak-accent focus:ring-offset-2 focus:ring-offset-ak-ink ${
          checked ? 'bg-ak-accent border-ak-accent' : 'bg-ak-surface-2 border-ak-line'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-none bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
      {label && <span className="text-sm text-white">{label}</span>}
    </label>
  );
}