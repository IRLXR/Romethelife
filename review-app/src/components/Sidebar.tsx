import { useRef, useState } from 'react';
import { useReview } from '../store/useReview';
import type { ManifestExport } from '../lib/types';
import type { View } from '../App';
import { IntakePanel } from './IntakePanel';

interface Props {
  view: View;
  setView: (v: View) => void;
}

export function Sidebar({ view, setView }: Props) {
  const session = useReview((s) => s.session);
  const assets = useReview((s) => s.assets);
  const decisions = useReview((s) => s.decisions);
  const cursor = useReview((s) => s.cursor);
  const setCursor = useReview((s) => s.setCursor);
  const setSessionName = useReview((s) => s.setSessionName);
  const addCriterion = useReview((s) => s.addCriterion);
  const removeCriterion = useReview((s) => s.removeCriterion);
  const renameCriterion = useReview((s) => s.renameCriterion);
  const exportManifest = useReview((s) => s.exportManifest);
  const importManifest = useReview((s) => s.importManifest);
  const resetAll = useReview((s) => s.resetAll);

  const importRef = useRef<HTMLInputElement>(null);
  const [newCriterion, setNewCriterion] = useState('');

  const liked = Object.values(decisions).filter((d) => d.status === 'liked').length;
  const skipped = Object.values(decisions).filter((d) => d.status === 'skipped').length;
  const pending = assets.length - liked - skipped;

  function doExport() {
    const manifest = exportManifest();
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.name.replace(/\s+/g, '-').toLowerCase()}-manifest.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as ManifestExport;
      if (parsed.version !== 1) {
        alert('Unsupported manifest version.');
        return;
      }
      importManifest(parsed);
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <input
          className="sidebar-brand"
          style={{
            border: 'none',
            padding: 0,
            background: 'transparent',
            width: '100%',
          }}
          value={session.name}
          onChange={(e) => setSessionName(e.target.value)}
          aria-label="Session name"
        />
        <div className="sidebar-sub">
          {assets.length} asset{assets.length === 1 ? '' : 's'} ·{' '}
          <span style={{ color: 'var(--like)' }}>{liked} liked</span> ·{' '}
          <span style={{ color: 'var(--skip)' }}>{skipped} skipped</span> ·{' '}
          {pending} pending
        </div>
      </div>

      <div className="sidebar-tabs">
        <button
          type="button"
          className={`sidebar-tab ${view === 'deck' ? 'is-active' : ''}`}
          onClick={() => setView('deck')}
        >
          Deck
        </button>
        <button
          type="button"
          className={`sidebar-tab ${view === 'gallery' ? 'is-active' : ''}`}
          onClick={() => setView('gallery')}
        >
          Gallery
        </button>
      </div>

      <div className="sidebar-scroll">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Add assets</div>
          <IntakePanel />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Criteria</div>
          <div className="sidebar-list">
            {session.criteria.map((c) => (
              <div className="sidebar-row" key={c.id}>
                <input
                  className="grow"
                  style={{ border: 'none', background: 'transparent', padding: 0 }}
                  value={c.label}
                  onChange={(e) => renameCriterion(c.id, e.target.value)}
                />
                <button
                  type="button"
                  className="icon"
                  title="Remove criterion"
                  onClick={() => removeCriterion(c.id)}
                >
                  &times;
                </button>
              </div>
            ))}
            <div className="row" style={{ marginTop: 4 }}>
              <input
                className="grow"
                placeholder="Add criterion"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCriterion.trim()) {
                    addCriterion(newCriterion.trim());
                    setNewCriterion('');
                  }
                }}
              />
              <button
                type="button"
                className="btn"
                onClick={() => {
                  if (!newCriterion.trim()) return;
                  addCriterion(newCriterion.trim());
                  setNewCriterion('');
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Queue</div>
          <div className="sidebar-list">
            {assets.length === 0 && <div className="sidebar-row ghost">No assets yet</div>}
            {assets.map((a, i) => {
              const d = decisions[a.id];
              return (
                <button
                  type="button"
                  className={`sidebar-row`}
                  style={{
                    background: i === cursor ? 'var(--bg-sunken)' : 'transparent',
                    border: '1px solid transparent',
                  }}
                  key={a.id}
                  onClick={() => setCursor(i)}
                  title={a.label ?? a.id}
                >
                  <span className={`tag ${d?.status ?? 'pending'}`}>
                    {d?.status === 'liked' ? 'liked' : d?.status === 'skipped' ? 'skip' : '·'}
                  </span>
                  <span className="grow">{a.label ?? a.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button type="button" className="btn" onClick={doExport}>
          Export manifest
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => importRef.current?.click()}
        >
          Import manifest
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={onImportFile}
        />
        <button
          type="button"
          className="btn danger"
          onClick={() => {
            if (confirm('Reset all assets and decisions? This deletes stored files.')) {
              void resetAll();
            }
          }}
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
