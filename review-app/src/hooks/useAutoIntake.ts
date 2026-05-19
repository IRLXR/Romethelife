import { useEffect, useRef } from 'react';
import { useReview } from '../store/useReview';

interface IntakeEntry {
  url: string;
  label?: string;
  model?: string;
  jobId?: string;
  timestamp?: number;
}

const POLL_MS = 2_000;

/**
 * Polls /intake.json every 2 s for new asset URLs written by the Cursor agent.
 * Deduplicates against URLs already in the queue so the same asset is never
 * added twice, even across page reloads.
 */
export function useAutoIntake(onNewCount?: (n: number) => void) {
  const addUrlAssets = useReview((s) => s.addUrlAssets);
  const assets = useReview((s) => s.assets);
  const seenUrls = useRef(new Set<string>());

  useEffect(() => {
    for (const a of assets) {
      if (a.source.kind === 'url') seenUrls.current.add(a.source.href);
    }
  }, [assets]);

  useEffect(() => {
    let active = true;

    async function poll() {
      if (!active) return;
      try {
        const res = await fetch(`/intake.json?t=${Date.now()}`);
        if (!res.ok) return;
        const entries: IntakeEntry[] = await res.json();
        if (!Array.isArray(entries)) return;

        const fresh: string[] = [];
        for (const e of entries) {
          const url = typeof e === 'string' ? e : e.url;
          if (!url || seenUrls.current.has(url)) continue;
          seenUrls.current.add(url);
          fresh.push(url);
        }

        if (fresh.length) {
          addUrlAssets(fresh);
          onNewCount?.(fresh.length);
        }
      } catch {
        // file might not exist yet — that's fine
      }
    }

    const id = window.setInterval(poll, POLL_MS);
    void poll();
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [addUrlAssets, onNewCount]);
}
