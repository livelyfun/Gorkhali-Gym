'use client';

import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import AkButton from './AkButton';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Please confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCancel();
    };
    d.addEventListener('cancel', handleCancel);
    return () => d.removeEventListener('cancel', handleCancel);
  }, [onCancel]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="ak-confirm-title"
      aria-describedby="ak-confirm-message"
      className="m-auto w-[calc(100%-2rem)] max-w-md bg-transparent p-0 outline-none backdrop:bg-black/70 backdrop:backdrop-blur-xs"
    >
      <div className="ak-panel ak-cut-tr p-6">
        <div className="flex items-start gap-3">
          <AlertCircle
            className={`w-5 h-5 shrink-0 mt-0.5 ${danger ? 'text-ak-accent' : 'text-ak-muted'}`}
          />
          <div className="min-w-0">
            <h2
              id="ak-confirm-title"
              className="text-sm font-display text-white uppercase tracking-wide"
            >
              {title}
            </h2>
            <p id="ak-confirm-message" className="mt-2 text-xs text-ak-muted leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <AkButton variant="ghost" onClick={onCancel} autoFocus={danger}>
            {cancelLabel}
          </AkButton>
          <AkButton
            variant={danger ? 'primary' : 'secondary'}
            onClick={onConfirm}
            autoFocus={!danger}
          >
            {confirmLabel}
          </AkButton>
        </div>
      </div>
    </dialog>
  );
}
