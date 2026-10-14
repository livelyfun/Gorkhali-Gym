'use client';

import React from 'react';

interface AkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article';
  cut?: boolean;
}

export default function AkCard({
  as: Tag = 'div',
  cut = false,
  className = '',
  children,
  ...rest
}: AkCardProps) {
  return (
    <Tag
      className={`ak-panel ${cut ? 'ak-cut-tr' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
