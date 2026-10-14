'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Link2,
  FolderOpen,
  X,
  Loader2,
  Check,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

export interface MediaAssetItem {
  id: string;
  url: string;
  filename: string;
  altText?: string | null;
  caption?: string | null;
}

interface ImagePickerFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  mediaAssets?: MediaAssetItem[];
  onUploadSuccess?: (asset: MediaAssetItem) => void;
  placeholder?: string;
  previewHeight?: string;
  round?: boolean;
  className?: string;
}

type Mode = 'url' | 'upload' | 'library';

export default function ImagePickerField({
  label,
  value,
  onChange,
  mediaAssets = [],
  onUploadSuccess,
  placeholder = 'https://example.com/photo.jpg or /images/...',
  previewHeight = 'h-36',
  round = false,
  className = '',
}: ImagePickerFieldProps) {
  const [mode, setMode] = useState<Mode>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // URL state & validation
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [savingToLibrary, setSavingToLibrary] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const trimmed = (value || '').trim();
    if (!trimmed) {
      const t = setTimeout(() => {
        if (cancelled) return;
        setImgLoading(false);
        setImgError(null);
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    // Check basic URL or path structure
    const isHttp = /^https?:\/\//i.test(trimmed);
    const isLocalPath = /^\/[a-zA-Z0-9_\-./%]/i.test(trimmed);
    const isDataUri = /^data:image\//i.test(trimmed);

    if (!isHttp && !isLocalPath && !isDataUri) {
      const t = setTimeout(() => {
        if (cancelled) return;
        setImgLoading(false);
        setImgError('Please enter a valid URL (starting with https://, http://, or /path).');
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    const t = setTimeout(() => {
      if (cancelled) return;
      setImgLoading(true);
      setImgError(null);
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value]);

  const handleUrlChange = (newUrl: string) => {
    // Sanitize whitespace and surrounding quotes, but never rewrite host or prepend localhost
    const sanitized = newUrl.trim().replace(/^["']|["']$/g, '');
    onChange(sanitized);
    setSavedToLibrary(false);
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      const form = new FormData();
      form.append('file', file);
      form.append('altText', file.name.replace(/\.[^/.]+$/, ''));

      try {
        const res = await fetch('/api/upload-local', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        onChange(data.url);
        setUploadSuccess(true);
        if (onUploadSuccess && data.asset) onUploadSuccess(data.asset);
        setTimeout(() => setUploadSuccess(false), 2500);
      } catch (err: unknown) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onChange, onUploadSuccess]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // Optional convenience: save currently entered external URL to media library
  const handleSaveUrlToLibrary = async () => {
    if (!value || imgError) return;
    setSavingToLibrary(true);
    try {
      let derivedFilename = 'external-image';
      try {
        const u = new URL(value);
        const lastPart = u.pathname.split('/').filter(Boolean).pop();
        if (lastPart) derivedFilename = decodeURIComponent(lastPart).slice(0, 40);
      } catch {
        // fallback for relative paths
        const lastPart = value.split('/').filter(Boolean).pop();
        if (lastPart) derivedFilename = lastPart.slice(0, 40);
      }

      const res = await fetch('/api/cms/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: value,
          filename: derivedFilename,
          altText: label || 'External gym media',
          caption: null,
          pathname: 'external',
          size: 0,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (res.ok && data.asset) {
        if (onUploadSuccess) onUploadSuccess(data.asset);
        setSavedToLibrary(true);
        setTimeout(() => setSavedToLibrary(false), 3000);
      }
    } catch {
      // ignore network errors for optional action
    } finally {
      setSavingToLibrary(false);
    }
  };

  const previewShape = round
    ? 'rounded-full w-24 h-24 mx-auto'
    : `rounded-none w-full ${previewHeight}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold uppercase text-ak-muted tracking-wider">
          {label}
        </label>
      )}

      {/* Preview Box */}
      <div
        className={`relative bg-ak-ink border border-ak-line overflow-hidden flex items-center justify-center ${previewShape}`}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imgError ? 'opacity-20 grayscale' : imgLoading ? 'opacity-40' : 'opacity-100'
              }`}
              onLoad={() => {
                setImgLoading(false);
                setImgError(null);
              }}
              onError={() => {
                setImgLoading(false);
                setImgError(
                  'Image failed to load. The URL may be invalid, inaccessible, or blocked (403).'
                );
              }}
            />

            {/* Loading Spinner */}
            {imgLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs gap-1.5 text-white text-[10px]">
                <Loader2 className="w-5 h-5 animate-spin text-ak-accent" />
                <span>Loading preview...</span>
              </div>
            )}

            {/* Error Overlay */}
            {imgError && (
              <div className="absolute inset-0 p-3 flex flex-col items-center justify-center bg-ak-accent/15 text-center gap-1 text-white">
                <AlertCircle className="w-5 h-5 text-ak-accent shrink-0" />
                <span className="text-[11px] font-semibold leading-tight">Image Inaccessible</span>
                <span className="text-[9px] text-ak-accent/80 max-w-xs line-clamp-2">
                  Verify the link returns a public image.
                </span>
              </div>
            )}

            {/* Success badge when loaded cleanly */}
            {!imgLoading && !imgError && (
              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[9px] font-mono flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <Check className="w-2.5 h-2.5" />
                <span>Valid Image</span>
              </div>
            )}

            {/* Clear Image Button */}
            <button
              type="button"
              onClick={() => {
                onChange('');
                setImgError(null);
                setImgLoading(false);
              }}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/75 text-white hover:bg-ak-accent transition-colors shadow-md"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-ak-muted">
            <ImageIcon className="w-7 h-7" />
            <span className="text-[10px]">No image configured</span>
          </div>
        )}
      </div>

      {/* Mode Tabs (URL / Upload / Library) */}
      <div className="flex rounded-none overflow-hidden border border-ak-line text-[10px] font-bold uppercase tracking-wider">
        {(['url', 'upload', 'library'] as Mode[]).map((m) => (
          <button
            type="button"
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors ${
              mode === m
                ? 'bg-ak-accent text-white shadow-sm'
                : 'bg-ak-surface text-ak-muted hover:text-white hover:bg-ak-surface-2'
            }`}
          >
            {m === 'url' && <Link2 className="w-3 h-3" />}
            {m === 'upload' && <Upload className="w-3 h-3" />}
            {m === 'library' && <FolderOpen className="w-3 h-3" />}
            <span>{m === 'library' ? 'Media Library' : m === 'url' ? 'External URL' : 'Upload File'}</span>
          </button>
        ))}
      </div>

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-ak-ink border border-ak-line rounded-none pl-3 pr-8 py-2 text-xs text-white font-mono placeholder:text-ak-muted focus:outline-none focus:border-ak-accent transition-colors"
            />
            {value && (
              <button
                type="button"
                onClick={() => handleUrlChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ak-muted hover:text-white"
                title="Clear URL"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Validation & Error Messaging */}
          {imgError && (
            <div className="p-2 rounded-none bg-ak-accent/10 border border-ak-accent/40 text-white text-[11px] flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-ak-accent shrink-0 mt-0.5" />
              <span>{imgError}</span>
            </div>
          )}

          {/* Helper info & Save to Library shortcut */}
          <div className="flex items-center justify-between text-[10px] text-ak-muted pt-0.5">
            <span className="truncate pr-2">
              Supports long external URLs from CDNs, search proxies, or /public paths.
            </span>
            {value && !imgError && (
              <button
                type="button"
                onClick={handleSaveUrlToLibrary}
                disabled={savingToLibrary || savedToLibrary}
                className="shrink-0 inline-flex items-center gap-1 text-ak-accent hover:text-ak-accent-light font-semibold transition-colors disabled:opacity-50"
              >
                {savingToLibrary ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : savedToLibrary ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Added to Library!</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3 h-3" />
                    <span>Save to Library</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-2">
          {uploadError && (
            <div className="p-2 rounded-none bg-ak-accent/10 border border-ak-accent/40 text-ak-accent text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-ak-accent shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all select-none ${
              dragOver
                ? 'border-ak-accent bg-ak-accent/10 scale-[0.98]'
                : 'border-ak-line hover:border-ak-accent/50 hover:bg-ak-surface/60'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-ak-accent">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold">Uploading...</span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <Check className="w-4 h-4" />
                <span className="text-xs font-semibold">Uploaded successfully!</span>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-ak-muted mx-auto mb-1.5" />
                <p className="text-xs text-white font-medium">
                  Drop image here or{' '}
                  <span className="text-ak-accent underline underline-offset-2">click to browse</span>
                </p>
                <p className="text-[10px] text-ak-muted mt-1">JPEG, PNG, WebP, GIF, SVG · Max 10MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {/* Library Mode */}
      {mode === 'library' && (
        <div>
          {mediaAssets.length === 0 ? (
            <div className="p-4 text-center text-[11px] text-ak-muted border border-dashed border-ak-line rounded-none">
              No media assets yet.{' '}
              <button
                type="button"
                onClick={() => setMode('upload')}
                className="text-ak-accent underline underline-offset-2"
              >
                Upload one
              </button>
              , or enter an external URL.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
              {mediaAssets.map((asset) => (
                <button
                  type="button"
                  key={asset.id}
                  onClick={() => {
                    onChange(asset.url);
                    setMode('url');
                  }}
                  title={asset.filename}
                  className={`relative aspect-square rounded-none overflow-hidden border-2 transition-all hover:opacity-90 ${
                    value === asset.url
                      ? 'border-ak-accent ring-1 ring-ak-accent'
                      : 'border-ak-line hover:border-ak-accent/50'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.filename}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover bg-ak-surface"
                  />
                  {value === asset.url && (
                    <div className="absolute inset-0 bg-ak-accent/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
