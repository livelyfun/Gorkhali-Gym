'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-ak-surface-2 animate-pulse rounded-none ${className}`}
    />
  );
}
