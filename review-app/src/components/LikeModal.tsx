import { useEffect } from 'react';
import type { Asset, ElementReference, StarValue } from '../lib/types';
import { useReview } from '../store/useReview';
import { Stars } from './Stars';
import { CriterionRow } from './CriterionRow';
import { MediaPreview } from './MediaPreview';

interface Props {
  asset: Asset;
  onClose: () => void;
  onSaveAndNext: () => void;
}

export function LikeModal({ asset, onClose, onSaveAndNext }: Props) {
  const decisions = useReview((s) => s.decisions);
  const session = useReview((s) => s.session);
  const setOverallStars = useReview((s) => s.setOverallStars);
  const setElementStars = useReview((s) => s.setElementStars);
  const setElementRef = useReview((s) => s.setElementRef);
  const setNotes = useReview((s) => s.setNotes);

  const decision = decisions[asset.id];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rate &amp; replace</h2>
          <span className="muted small">{asset.label ?? asset.id}</span>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 220px) 1fr',
              gap: 16,
              alignItems: 'start',
            }}
          >
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'black',
                aspectRatio: '9 / 16',
              }}
            >
              <MediaPreview asset={asset} className="media" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div className="muted small" style={{ marginBottom: 4 }}>
                  Overall
                </div>
                <Stars
                  value={decision?.overallStars ?? 0}
                  onChange={(v) => setOverallStars(asset.id, v)}
                  size="lg"
                />
              </div>
              <div>
                <div className="muted small" style={{ marginBottom: 4 }}>
                  Notes
                </div>
                <textarea
                  className="note-input"
                  value={decision?.notes ?? ''}
                  onChange={(e) => setNotes(asset.id, e.target.value)}
                  placeholder="What did you keep, what would you change?"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="muted small" style={{ marginBottom: 8 }}>
              Elements — score each and optionally drop a replacement reference
            </div>
            <div className="criteria-grid">
              {session.criteria.map((c) => (
                <CriterionRow
                  key={c.id}
                  criterion={c}
                  review={decision?.elements[c.id]}
                  onStars={(v: StarValue) => setElementStars(asset.id, c.id, v)}
                  onRef={(ref: ElementReference | undefined) => setElementRef(asset.id, c.id, ref)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn ghost" onClick={onClose}>
            Stay here
          </button>
          <button type="button" className="btn primary" onClick={onSaveAndNext}>
            Save &amp; next
          </button>
        </div>
      </div>
    </div>
  );
}
