'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import type { SocialVideoItem } from '@/lib/data-store';
import { PLATFORM_LABELS, validateSocialVideo } from '@/lib/social-video';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface SocialVideoEmbedProps {
  video: SocialVideoItem;
  className?: string;
}

export default function SocialVideoEmbed({ video, className = '' }: SocialVideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('idle');

  const validation = validateSocialVideo(video.url);
  const platformLabel = PLATFORM_LABELS[video.platform] || 'Video';
  const externalHref = validation.normalizedUrl || video.url;
  const embedSrc = video.embedUrl || validation.embedUrl || null;
  const canEmbed = Boolean(validation.ok && embedSrc);

  const startPlayback = () => {
    if (!canEmbed) return;
    setStatus('loading');
    setPlaying(true);
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden ak-panel ak-cut-tr ak-frame ${className}`}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-ak-surface-2">
        {playing && canEmbed ? (
          <>
            <iframe
              src={embedSrc as string}
              title={video.title || `${platformLabel} video`}
              style={{ width: '100%', height: '100%' }}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              onLoad={() => setStatus((s) => (s === 'error' ? s : 'loaded'))}
              onError={() => setStatus('error')}
            />
            {status === 'loading' && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ak-ink/80">
                <Loader2 className="h-6 w-6 animate-spin text-ak-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-ak-muted">
                  Loading {platformLabel}…
                </span>
              </div>
            )}
          </>
        ) : canEmbed ? (
          <button
            type="button"
            onClick={startPlayback}
            aria-label={`Play ${video.title || `${platformLabel} video`}`}
            className="ak-focus absolute inset-0 flex h-full w-full items-center justify-center"
          >
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.title || `${platformLabel} video thumbnail`}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                referrerPolicy="no-referrer"
                className="ak-img object-cover object-center opacity-80 transition-opacity group-hover:opacity-100"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ak-surface via-ak-surface-2 to-ak-ink" />
            )}

            <span className="relative flex h-14 w-14 items-center justify-center border border-ak-accent/60 bg-ak-ink/70 backdrop-blur-sm transition-transform group-hover:scale-105">
              <Play className="h-6 w-6 -skew-x-12 fill-ak-accent text-ak-accent" />
            </span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ak-ink/80 via-transparent to-transparent" />
          </button>
        ) : (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${video.title || `${platformLabel} video`} on ${platformLabel}`}
            className="ak-focus absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3"
          >
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.title || `${platformLabel} video thumbnail`}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                referrerPolicy="no-referrer"
                className="ak-img object-cover object-center opacity-80 transition-opacity group-hover:opacity-100"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ak-surface via-ak-surface-2 to-ak-ink" />
            )}
            <span className="relative flex h-14 w-14 items-center justify-center border border-ak-accent/60 bg-ak-ink/70 backdrop-blur-sm">
              <ExternalLink className="h-6 w-6 text-ak-accent" />
            </span>
            <span className="relative text-[10px] font-bold uppercase tracking-widest text-white">
              Watch on {platformLabel}
            </span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ak-ink/80 via-transparent to-transparent" />
          </a>
        )}

        {status === 'error' && playing && canEmbed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ak-ink/90 px-4 text-center">
            <AlertCircle className="h-6 w-6 text-ak-accent" />
            <p className="text-xs text-ak-muted">
              The embed failed to load.
            </p>
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ak-focus inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ak-accent hover:text-white"
            >
              Watch on {platformLabel}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        <span className="pointer-events-none absolute left-3 top-3 bg-ak-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          {platformLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-sm uppercase tracking-wide text-white">
          {video.title}
        </h3>
        {video.caption && (
          <p className="mt-1 text-xs leading-relaxed text-ak-muted">{video.caption}</p>
        )}
        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ak-focus mt-3 inline-flex items-center gap-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-ak-muted transition-colors hover:text-ak-accent"
        >
          Watch on {platformLabel}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
