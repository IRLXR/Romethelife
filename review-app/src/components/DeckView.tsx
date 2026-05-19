import { useCallback, useEffect, useRef, useState } from 'react';
import { useReview } from '../store/useReview';
import { MediaPreview } from './MediaPreview';
import { LikePanel } from './LikePanel';
import { LikeModal } from './LikeModal';
import type { Asset } from '../lib/types';

export function DeckView() {
  const assets = useReview((s) => s.assets);
  const cursor = useReview((s) => s.cursor);
  const setCursor = useReview((s) => s.setCursor);
  const goNext = useReview((s) => s.goNext);
  const goPrev = useReview((s) => s.goPrev);
  const decide = useReview((s) => s.decide);
  const decisions = useReview((s) => s.decisions);
  const removeAsset = useReview((s) => s.removeAsset);

  const current: Asset | undefined = assets[cursor];
  const currentDecision = current ? decisions[current.id] : undefined;

  const cardRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ dx: number; active: boolean }>({ dx: 0, active: false });
  const [modalOpen, setModalOpen] = useState(false);

  const handleSkip = useCallback(() => {
    if (!current) return;
    decide(current.id, 'skipped');
    goNext();
  }, [current, decide, goNext]);

  const handleLike = useCallback(() => {
    if (!current) return;
    decide(current.id, 'liked');
    setModalOpen(true);
  }, [current, decide]);

  const handleUndo = useCallback(() => {
    if (!current) return;
    decide(current.id, 'pending');
  }, [current, decide]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (modalOpen) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLike();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key.toLowerCase() === 'u') {
        handleUndo();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSkip, handleLike, handleUndo, goNext, goPrev, modalOpen]);

  useEffect(() => {
    setDrag({ dx: 0, active: false });
  }, [cursor]);

  function onPointerDown(e: React.PointerEvent) {
    if (!current) return;
    if ((e.target as HTMLElement).closest('video, button')) return;
    cardRef.current?.setPointerCapture(e.pointerId);
    setDrag({ dx: 0, active: true });
    (cardRef.current as HTMLDivElement & { _startX?: number })._startX = e.clientX;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.active) return;
    const startX = (cardRef.current as (HTMLDivElement & { _startX?: number }) | null)?._startX;
    if (typeof startX !== 'number') return;
    const dx = e.clientX - startX;
    setDrag({ dx, active: true });
  }

  function onPointerUp() {
    if (!drag.active) return;
    const threshold = 110;
    if (drag.dx > threshold) {
      handleLike();
    } else if (drag.dx < -threshold) {
      handleSkip();
    }
    setDrag({ dx: 0, active: false });
  }

  if (!assets.length) {
    return (
      <div className="workspace no-sidepanel">
        <div className="deck-area">
          <div className="deck-empty">
            <h2>No assets yet</h2>
            <p>Use the left sidebar to paste URLs, drop files, or pick a folder.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="workspace no-sidepanel">
        <div className="deck-area">
          <div className="deck-empty">
            <h2>Queue finished</h2>
            <p>Open the gallery to review your liked picks.</p>
          </div>
        </div>
      </div>
    );
  }

  const rotation = Math.max(-12, Math.min(12, drag.dx / 12));
  const likeOpacity = Math.max(0, Math.min(1, drag.dx / 120));
  const skipOpacity = Math.max(0, Math.min(1, -drag.dx / 120));

  return (
    <div className="workspace">
      <div className="deck-area">
        <div
          ref={cardRef}
          className={`deck-card ${drag.active ? 'is-dragging' : ''}`}
          style={{
            transform: `translateX(${drag.dx}px) rotate(${rotation}deg)`,
            transition: drag.active ? 'none' : 'transform 200ms ease',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <MediaPreview asset={current} className="media" />
          <div className="deck-overlay-badge like" style={{ opacity: likeOpacity }}>
            Like
          </div>
          <div className="deck-overlay-badge skip" style={{ opacity: skipOpacity }}>
            Skip
          </div>
        </div>

        <div className="deck-meta">
          <span className="filename">{current.label ?? current.id}</span>
          <span>
            {cursor + 1} / {assets.length}
            {currentDecision?.status && currentDecision.status !== 'pending'
              ? ` · ${currentDecision.status}`
              : ''}
          </span>
        </div>

        <div className="deck-controls">
          <button type="button" className="btn skip lg" onClick={handleSkip}>
            Skip
          </button>
          <button type="button" className="btn lg" onClick={handleUndo}>
            Reset
          </button>
          <button type="button" className="btn like lg" onClick={handleLike}>
            Like
          </button>
        </div>

        <div className="deck-controls">
          <button type="button" className="btn ghost" onClick={() => setCursor(cursor - 1)}>
            Prev
          </button>
          <button
            type="button"
            className="btn ghost danger"
            onClick={() => {
              if (confirm('Remove this asset from the queue?')) {
                void removeAsset(current.id);
              }
            }}
          >
            Remove
          </button>
          <button type="button" className="btn ghost" onClick={() => setCursor(cursor + 1)}>
            Next
          </button>
        </div>

        <div className="shortcut-hint">
          <kbd>&larr;</kbd> skip · <kbd>&rarr;</kbd> like · <kbd>space</kbd> like ·{' '}
          <kbd>&uarr;</kbd>/<kbd>&darr;</kbd> nav · <kbd>U</kbd> reset
        </div>
      </div>

      <LikePanel asset={current} onOpenModal={() => setModalOpen(true)} />

      {modalOpen && (
        <LikeModal
          asset={current}
          onClose={() => setModalOpen(false)}
          onSaveAndNext={() => {
            setModalOpen(false);
            goNext();
          }}
        />
      )}
    </div>
  );
}
