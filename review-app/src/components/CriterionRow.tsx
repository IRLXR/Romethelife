import { useEffect, useState } from 'react';
import type { CriterionDef, ElementReference, ElementReview, StarValue } from '../lib/types';
import { Stars } from './Stars';
import { putBlob, getBlob } from '../lib/db';
import { makeId, classifyMime, classifyUrl } from '../lib/id';

interface Props {
  criterion: CriterionDef;
  review: ElementReview | undefined;
  onStars: (v: StarValue) => void;
  onRef: (ref: ElementReference | undefined) => void;
}

export function CriterionRow({ criterion, review, onStars, onRef }: Props) {
  const ref = review?.ref;
  const stars = review?.stars ?? 0;
  const [dragOver, setDragOver] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [thumbs, setThumbs] = useState<Array<{ id: string; url: string; mime: string }>>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadThumbs() {
      const ids = ref?.blobIds ?? [];
      if (!ids.length) {
        if (!cancelled) setThumbs([]);
        return;
      }
      const out: Array<{ id: string; url: string; mime: string }> = [];
      for (const id of ids) {
        const rec = await getBlob(id);
        if (rec) {
          out.push({ id, url: URL.createObjectURL(rec.blob), mime: rec.mime });
        }
      }
      if (!cancelled) setThumbs(out);
    }
    void loadThumbs();
    return () => {
      cancelled = true;
      for (const t of thumbs) URL.revokeObjectURL(t.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.blobIds?.join(',')]);

  async function addFiles(files: File[]) {
    const accepted = files.filter((f) => classifyMime(f.type) !== 'other');
    if (!accepted.length) return;
    const newIds: string[] = [];
    for (const f of accepted) {
      const id = makeId('b');
      await putBlob({ id, blob: f, name: f.name, mime: f.type, createdAt: Date.now() });
      newIds.push(id);
    }
    const next: ElementReference = {
      ...(ref ?? {}),
      blobIds: [...(ref?.blobIds ?? []), ...newIds],
    };
    onRef(next);
  }

  function attachUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    if (classifyUrl(trimmed) === 'other') {
      if (!confirm('That URL does not look like an image or video. Attach anyway?')) return;
    }
    const next: ElementReference = { ...(ref ?? {}), url: trimmed };
    onRef(next);
    setUrlDraft('');
  }

  function removeUrl() {
    if (!ref) return;
    const next: ElementReference = { ...ref, url: undefined };
    onRef(next.blobIds?.length || next.note ? next : undefined);
  }

  function removeBlob(id: string) {
    if (!ref) return;
    const list = (ref.blobIds ?? []).filter((b) => b !== id);
    const next: ElementReference = { ...ref, blobIds: list };
    onRef(next.url || list.length || next.note ? next : undefined);
  }

  function setNote(note: string) {
    const trimmed = note.trim();
    const base: ElementReference = { ...(ref ?? {}) };
    if (trimmed) base.note = trimmed;
    else delete base.note;
    const hasContent = base.url || (base.blobIds?.length ?? 0) > 0 || base.note;
    onRef(hasContent ? base : undefined);
  }

  return (
    <div className="criterion-card">
      <div className="criterion-head">
        <div className="grow">
          <div className="name">{criterion.label}</div>
          {criterion.hint && <div className="hint">{criterion.hint}</div>}
        </div>
        <Stars value={stars as StarValue} onChange={onStars} />
      </div>

      <div
        className={`ref-slot ${dragOver ? 'is-dragover' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setDragOver(false);
          const files: File[] = [];
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            files.push(e.dataTransfer.files[i]);
          }
          if (files.length) await addFiles(files);
          const text = e.dataTransfer.getData('text/plain');
          if (text) {
            const next: ElementReference = { ...(ref ?? {}), url: text.trim() };
            onRef(next);
          }
        }}
      >
        <div className="row between">
          <span className="muted small">Replacement reference</span>
          <label className="btn ghost small">
            Attach file
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              style={{ display: 'none' }}
              onChange={async (e) => {
                const list = e.target.files;
                if (!list) return;
                const files: File[] = [];
                for (let i = 0; i < list.length; i++) files.push(list[i]);
                await addFiles(files);
                e.target.value = '';
              }}
            />
          </label>
        </div>

        <div className="row">
          <input
            placeholder="Or paste reference URL"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') attachUrl();
            }}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="btn"
            onClick={attachUrl}
            disabled={!urlDraft.trim()}
          >
            Attach
          </button>
        </div>

        {ref?.url && (
          <div className="row between small">
            <a href={ref.url} target="_blank" rel="noreferrer" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ref.url}
            </a>
            <button type="button" className="btn ghost small" onClick={removeUrl}>
              Remove
            </button>
          </div>
        )}

        {!!thumbs.length && (
          <div className="ref-thumbs">
            {thumbs.map((t) => (
              <div className="ref-thumb" key={t.id}>
                {t.mime.startsWith('video/') ? (
                  <video src={t.url} muted />
                ) : (
                  <img src={t.url} alt="ref" />
                )}
                <button type="button" className="remove" onClick={() => removeBlob(t.id)} aria-label="Remove">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          className="note-input"
          placeholder="Notes for this element (optional)"
          value={ref?.note ?? ''}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </div>
  );
}
