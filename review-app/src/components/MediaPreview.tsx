import { useEffect, useState } from 'react';
import type { Asset } from '../lib/types';
import { getBlobUrl } from '../lib/blobUrls';

interface Props {
  asset: Asset;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function MediaPreview({
  asset,
  className,
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
}: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (asset.source.kind === 'url') {
        if (!cancelled) setSrc(asset.source.href);
        return;
      }
      const url = await getBlobUrl(asset.source.blobId);
      if (!cancelled) setSrc(url);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [asset]);

  if (!src) {
    return <div className={className} style={{ background: 'var(--bg-sunken)' }} />;
  }

  if (asset.kind === 'image') {
    return <img className={className} src={src} alt={asset.label ?? ''} draggable={false} />;
  }
  return (
    <video
      className={className}
      src={src}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
    />
  );
}
