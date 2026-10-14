'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface AkTabItem<T extends string = string> {
  id: T;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeVariant?: 'accent' | 'amber';
  group?: string;
}

interface AkTabNavProps<T extends string = string> {
  items: AkTabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
  mobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const BADGE_STYLES: Record<'accent' | 'amber', string> = {
  accent: 'bg-ak-accent text-white',
  amber: 'bg-amber-500 text-black',
};

export default function AkTabNav<T extends string = string>({
  items,
  active,
  onChange,
  className = '',
  mobileOpen,
  onMobileToggle,
}: AkTabNavProps) {
  // Group items
  const groups = new Map<string | undefined, AkTabItem[]>();
  for (const item of items) {
    const key = item.group;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {mobileOpen !== undefined && onMobileToggle && (
        <button
          type="button"
          onClick={onMobileToggle}
          className="lg:hidden w-full py-3 px-3 bg-ak-surface border-b border-ak-line text-left text-sm font-bold uppercase tracking-wider text-white flex items-center justify-between"
        >
          <span>Menu</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
      )}
      <nav
        className={`flex-1 flex flex-col overflow-y-auto ${mobileOpen === false ? 'hidden lg:flex' : ''}`}
        role="navigation"
        aria-label="Admin sections"
      >
        {Array.from(groups.entries()).map(([group, groupItems]) => (
          <div key={group ?? '__default'} className="p-3 space-y-1">
            {group && (
              <div className="px-3 pb-1 text-[10px] font-bold text-ak-muted uppercase tracking-widest border-b border-ak-line mb-1">
                {group}
              </div>
            )}
            {groupItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  active === item.id
                    ? 'bg-ak-accent text-white shadow-md shadow-ak-accent/20'
                    : 'text-ak-muted hover:text-white hover:bg-ak-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_STYLES[item.badgeVariant ?? 'accent']}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}