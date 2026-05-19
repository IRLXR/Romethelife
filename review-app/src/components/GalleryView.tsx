import { useMemo, useState } from 'react';
import { useReview } from '../store/useReview';
import { MediaPreview } from './MediaPreview';
import { buildLikedCsv } from '../lib/csv';

type SortKey = 'overall_desc' | 'overall_asc' | 'recent' | 'oldest';
type StatusFilter = 'liked' | 'skipped' | 'pending' | 'all';

export function GalleryView() {
  const session = useReview((s) => s.session);
  const assets = useReview((s) => s.assets);
  const decisions = useReview((s) => s.decisions);
  const exportManifest = useReview((s) => s.exportManifest);

  const [status, setStatus] = useState<StatusFilter>('liked');
  const [sort, setSort] = useState<SortKey>('overall_desc');
  const [minStars, setMinStars] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = assets.filter((a) => {
      const d = decisions[a.id];
      if (status !== 'all') {
        const s = d?.status ?? 'pending';
        if (s !== status) return false;
      }
      if ((d?.overallStars ?? 0) < minStars) return false;
      if (q) {
        const label = (a.label ?? '').toLowerCase();
        const src = a.source.kind === 'url' ? a.source.href.toLowerCase() : a.source.name.toLowerCase();
        if (!label.includes(q) && !src.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      const da = decisions[a.id];
      const db = decisions[b.id];
      switch (sort) {
        case 'overall_desc':
          return (db?.overallStars ?? 0) - (da?.overallStars ?? 0);
        case 'overall_asc':
          return (da?.overallStars ?? 0) - (db?.overallStars ?? 0);
        case 'recent':
          return (b.createdAt ?? 0) - (a.createdAt ?? 0);
        case 'oldest':
        default:
          return (a.createdAt ?? 0) - (b.createdAt ?? 0);
      }
    });
    return list;
  }, [assets, decisions, status, sort, minStars, search]);

  function exportJson() {
    const manifest = exportManifest();
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.name.replace(/\s+/g, '-').toLowerCase()}-manifest.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportCsv() {
    const csv = buildLikedCsv(session, assets, decisions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.name.replace(/\s+/g, '-').toLowerCase()}-liked.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="gallery-toolbar">
        <strong style={{ fontFamily: 'var(--font-serif)' }}>Gallery</strong>
        <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
          <option value="liked">Liked</option>
          <option value="skipped">Skipped</option>
          <option value="pending">Pending</option>
          <option value="all">All</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="overall_desc">Stars: high → low</option>
          <option value="overall_asc">Stars: low → high</option>
          <option value="recent">Recently added</option>
          <option value="oldest">Oldest first</option>
        </select>
        <select value={minStars} onChange={(e) => setMinStars(Number(e.target.value))}>
          <option value={0}>Any rating</option>
          <option value={1}>≥ 1 star</option>
          <option value={2}>≥ 2 stars</option>
          <option value={3}>≥ 3 stars</option>
          <option value={4}>≥ 4 stars</option>
          <option value={5}>5 stars only</option>
        </select>
        <input
          placeholder="Search filename / URL"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <div className="row">
          <button type="button" className="btn" onClick={exportCsv}>
            Export CSV
          </button>
          <button type="button" className="btn primary" onClick={exportJson}>
            Export JSON
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="deck-empty" style={{ margin: 24 }}>
          <h2>No assets match</h2>
          <p>Try widening the filter, or like more assets from the deck.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map((a) => {
            const d = decisions[a.id];
            return (
              <div className="gallery-card" key={a.id}>
                <div className="thumb">
                  <MediaPreview asset={a} controls={false} muted />
                </div>
                <div className="body">
                  <div className="row between">
                    <span>{'★'.repeat(d?.overallStars ?? 0) || '—'}</span>
                    <span className={`tag ${d?.status ?? 'pending'}`}>{d?.status ?? 'pending'}</span>
                  </div>
                  <div className="filename" title={a.label}>
                    {a.label ?? a.id}
                  </div>
                  {!!session.criteria.length && (
                    <div className="row wrap" style={{ gap: 4 }}>
                      {session.criteria.map((c) => {
                        const s = d?.elements?.[c.id]?.stars ?? 0;
                        if (!s) return null;
                        return (
                          <span className="tag" key={c.id} title={c.label}>
                            {c.label}: {s}★
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
