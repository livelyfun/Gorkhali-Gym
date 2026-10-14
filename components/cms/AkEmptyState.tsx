'use client';

import React from 'react';

interface AkEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function AkEmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: AkEmptyStateProps) {
  return (
    <div className={`text-center py-16 ak-panel ak-cut-tr ${className}`}>
      <div className="w-12 h-12 text-neutral-600 mx-auto mb-3 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-display text-lg text-white">{title}</h3>
      {description && (
        <p className="text-sm text-ak-muted mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}