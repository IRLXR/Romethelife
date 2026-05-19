import type { Asset, ElementReference, StarValue } from '../lib/types';
import { useReview } from '../store/useReview';
import { Stars } from './Stars';
import { CriterionRow } from './CriterionRow';

interface Props {
  asset: Asset;
  onOpenModal: () => void;
}

export function LikePanel({ asset, onOpenModal }: Props) {
  const decisions = useReview((s) => s.decisions);
  const session = useReview((s) => s.session);
  const setOverallStars = useReview((s) => s.setOverallStars);
  const setElementStars = useReview((s) => s.setElementStars);
  const setElementRef = useReview((s) => s.setElementRef);
  const setNotes = useReview((s) => s.setNotes);

  const decision = decisions[asset.id];
  const liked = decision?.status === 'liked';

  return (
    <aside className="side-panel">
      <div className="panel-section">
        <div className="row between">
          <h3>Overall</h3>
          <span className={`tag ${decision?.status ?? 'pending'}`}>
            {decision?.status ?? 'pending'}
          </span>
        </div>
        <p className="lead">
          {liked
            ? 'Rate this asset and the key elements below. References are stored locally.'
            : 'Like the asset to start rating.'}
        </p>
        <Stars
          value={decision?.overallStars ?? 0}
          onChange={(v) => setOverallStars(asset.id, v)}
          size="lg"
          readOnly={!liked}
        />
        <div style={{ marginTop: 10 }}>
          <button type="button" className="btn" onClick={onOpenModal} disabled={!liked}>
            Expand rating
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>Elements</h3>
        {!liked && <p className="lead">Like first to enable element ratings.</p>}
        {liked && (
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
        )}
      </div>

      <div className="panel-section">
        <h3>Notes</h3>
        <textarea
          className="note-input"
          placeholder="Free-form notes for this asset"
          value={decision?.notes ?? ''}
          onChange={(e) => setNotes(asset.id, e.target.value)}
          disabled={!liked}
        />
      </div>
    </aside>
  );
}
