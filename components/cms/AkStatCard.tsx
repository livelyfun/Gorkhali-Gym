'use client';

import React from 'react';

interface AkStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export default function AkStatCard({
  label,
  value,
  icon,
  iconColor = 'ak-accent',
  trend,
  className = '',
}: AkStatCardProps) {
  return (
    <div className={`ak-panel ak-cut-tr p-6 space-y-2 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ak-muted">{label}</p>
          <p className="font-display text-3xl text-white truncate">{value}</p>
        </div>
        {icon && (
          <div className={`w-10 h-10 bg-${iconColor}/20 text-${iconColor} flex items-center justify-center shrink-0`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className={`text-[11px] font-semibold ${trend.value >= 0 ? 'text-emerald-400' : 'text-ak-accent'}`}>
          {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)} {trend.label}
        </p>
      )}
    </div>
  );
}