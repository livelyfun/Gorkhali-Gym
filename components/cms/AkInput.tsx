'use client';

import React from 'react';

const AkInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function AkInput({ className = '', type = 'text', ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={`w-full bg-ak-ink border border-ak-line rounded-none px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-ak-accent transition-colors ak-focus ${className}`}
        {...rest}
      />
    );
  }
);

export default AkInput;
