'use client';

import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <p className="ak-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-display text-white">{title}</h2>
        {description && (
          <p className="mt-2 text-xs text-ak-muted leading-relaxed max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
