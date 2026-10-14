'use client';

import React from 'react';

interface AkPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function AkPageHeader({ title, description, action, className = '' }: AkPageHeaderProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-2xl font-display text-white uppercase tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-ak-muted mt-1 leading-relaxed max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}