import { create } from 'zustand';
import {
  type Asset,
  type Decision,
  type DecisionStatus,
  type ElementReference,
  type ManifestExport,
  type ReviewSession,
  type StarValue,
  DEFAULT_CRITERIA,
} from '../lib/types';
import { kvGet, kvSet, putBlob, deleteBlob } from '../lib/db';
import { classifyMime, classifyUrl, makeId } from '../lib/id';

const STATE_KEY = 'review-state-v1';

interface PersistedState {
  session: ReviewSession;
  assets: Asset[];
  decisions: Record<string, Decision>;
  cursor: number;
}

interface ReviewState extends PersistedState {
  initialized: boolean;
  hydrate: () => Promise<void>;
  setSessionName: (name: string) => void;
  addCriterion: (label: string, hint?: string) => void;
  removeCriterion: (id: string) => void;
  renameCriterion: (id: string, label: string) => void;

  addUrlAssets: (urls: string[]) => void;
  addFileAssets: (files: File[]) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;

  goNext: () => void;
  goPrev: () => void;
  setCursor: (n: number) => void;

  decide: (assetId: string, status: DecisionStatus) => void;
  setOverallStars: (assetId: string, stars: StarValue) => void;
  setElementStars: (assetId: string, elementId: string, stars: StarValue) => void;
  setElementRef: (assetId: string, elementId: string, ref: ElementReference | undefined) => void;
  setNotes: (assetId: string, notes: string) => void;

  exportManifest: () => ManifestExport;
  importManifest: (m: ManifestExport) => void;
  resetAll: () => Promise<void>;
}

function emptyDecision(assetId: string): Decision {
  return {
    assetId,
    status: 'pending',
    overallStars: 0,
    elements: {},
  };
}

function freshSession(): ReviewSession {
  return {
    id: makeId('s'),
    name: 'New review',
    createdAt: Date.now(),
    criteria: DEFAULT_CRITERIA.map((c) => ({ ...c })),
  };
}

let saveTimer: number | null = null;
function scheduleSave(get: () => ReviewState) {
  if (saveTimer !== null) {
    window.clearTimeout(saveTimer);
  }
  saveTimer = window.setTimeout(() => {
    const { session, assets, decisions, cursor } = get();
    const snapshot: PersistedState = { session, assets, decisions, cursor };
    void kvSet(STATE_KEY, snapshot);
  }, 200);
}

export const useReview = create<ReviewState>((set, get) => ({
  initialized: false,
  session: freshSession(),
  assets: [],
  decisions: {},
  cursor: 0,

  async hydrate() {
    const stored = await kvGet<PersistedState>(STATE_KEY);
    if (stored && stored.session && Array.isArray(stored.assets)) {
      set({
        session: stored.session,
        assets: stored.assets,
        decisions: stored.decisions ?? {},
        cursor: Math.min(stored.cursor ?? 0, Math.max(stored.assets.length - 1, 0)),
        initialized: true,
      });
    } else {
      set({ initialized: true });
    }
  },

  setSessionName(name) {
    set((s) => ({ session: { ...s.session, name } }));
    scheduleSave(get);
  },

  addCriterion(label, hint) {
    set((s) => ({
      session: {
        ...s.session,
        criteria: [...s.session.criteria, { id: makeId('c'), label, hint }],
      },
    }));
    scheduleSave(get);
  },

  removeCriterion(id) {
    set((s) => ({
      session: {
        ...s.session,
        criteria: s.session.criteria.filter((c) => c.id !== id),
      },
    }));
    scheduleSave(get);
  },

  renameCriterion(id, label) {
    set((s) => ({
      session: {
        ...s.session,
        criteria: s.session.criteria.map((c) => (c.id === id ? { ...c, label } : c)),
      },
    }));
    scheduleSave(get);
  },

  addUrlAssets(urls) {
    const created: Asset[] = [];
    const decisions = { ...get().decisions };
    for (const raw of urls) {
      const href = raw.trim();
      if (!href) continue;
      const kind = classifyUrl(href);
      if (kind === 'other') continue;
      const id = makeId('a');
      created.push({
        id,
        source: { kind: 'url', href },
        kind,
        createdAt: Date.now(),
        label: href.split('/').pop() ?? href,
      });
      decisions[id] = emptyDecision(id);
    }
    if (!created.length) return;
    set((s) => ({ assets: [...s.assets, ...created], decisions }));
    scheduleSave(get);
  },

  async addFileAssets(files) {
    const created: Asset[] = [];
    const decisions = { ...get().decisions };
    for (const file of files) {
      const kind = classifyMime(file.type);
      if (kind === 'other') continue;
      const blobId = makeId('b');
      await putBlob({
        id: blobId,
        blob: file,
        name: file.name,
        mime: file.type,
        createdAt: Date.now(),
      });
      const id = makeId('a');
      created.push({
        id,
        source: { kind: 'file', blobId, name: file.name, mime: file.type },
        kind,
        createdAt: Date.now(),
        label: file.name,
      });
      decisions[id] = emptyDecision(id);
    }
    if (!created.length) return;
    set((s) => ({ assets: [...s.assets, ...created], decisions }));
    scheduleSave(get);
  },

  async removeAsset(id) {
    const asset = get().assets.find((a) => a.id === id);
    if (asset?.source.kind === 'file') {
      try {
        await deleteBlob(asset.source.blobId);
      } catch {
        // best effort
      }
    }
    const decisions = { ...get().decisions };
    delete decisions[id];
    set((s) => {
      const nextAssets = s.assets.filter((a) => a.id !== id);
      const nextCursor = Math.min(s.cursor, Math.max(nextAssets.length - 1, 0));
      return { assets: nextAssets, decisions, cursor: nextCursor };
    });
    scheduleSave(get);
  },

  goNext() {
    set((s) => ({ cursor: Math.min(s.cursor + 1, Math.max(s.assets.length - 1, 0)) }));
    scheduleSave(get);
  },

  goPrev() {
    set((s) => ({ cursor: Math.max(s.cursor - 1, 0) }));
    scheduleSave(get);
  },

  setCursor(n) {
    set((s) => ({ cursor: Math.max(0, Math.min(n, Math.max(s.assets.length - 1, 0))) }));
    scheduleSave(get);
  },

  decide(assetId, status) {
    const decisions = { ...get().decisions };
    const prev = decisions[assetId] ?? emptyDecision(assetId);
    decisions[assetId] = { ...prev, status, decidedAt: Date.now() };
    set({ decisions });
    scheduleSave(get);
  },

  setOverallStars(assetId, stars) {
    const decisions = { ...get().decisions };
    const prev = decisions[assetId] ?? emptyDecision(assetId);
    decisions[assetId] = { ...prev, overallStars: stars };
    set({ decisions });
    scheduleSave(get);
  },

  setElementStars(assetId, elementId, stars) {
    const decisions = { ...get().decisions };
    const prev = decisions[assetId] ?? emptyDecision(assetId);
    const elements = { ...prev.elements };
    elements[elementId] = { ...(elements[elementId] ?? { stars: 0 }), stars };
    decisions[assetId] = { ...prev, elements };
    set({ decisions });
    scheduleSave(get);
  },

  setElementRef(assetId, elementId, ref) {
    const decisions = { ...get().decisions };
    const prev = decisions[assetId] ?? emptyDecision(assetId);
    const elements = { ...prev.elements };
    const current = elements[elementId] ?? { stars: 0 as StarValue };
    elements[elementId] = { ...current, ref };
    decisions[assetId] = { ...prev, elements };
    set({ decisions });
    scheduleSave(get);
  },

  setNotes(assetId, notes) {
    const decisions = { ...get().decisions };
    const prev = decisions[assetId] ?? emptyDecision(assetId);
    decisions[assetId] = { ...prev, notes };
    set({ decisions });
    scheduleSave(get);
  },

  exportManifest() {
    const s = get();
    return {
      version: 1,
      exportedAt: Date.now(),
      session: s.session,
      assets: s.assets,
      decisions: Object.values(s.decisions),
    };
  },

  importManifest(m) {
    const decisionMap: Record<string, Decision> = {};
    for (const d of m.decisions) {
      decisionMap[d.assetId] = d;
    }
    set({
      session: m.session,
      assets: m.assets,
      decisions: decisionMap,
      cursor: 0,
    });
    scheduleSave(get);
  },

  async resetAll() {
    const s = get();
    for (const a of s.assets) {
      if (a.source.kind === 'file') {
        try {
          await deleteBlob(a.source.blobId);
        } catch {
          // best effort
        }
      }
    }
    set({
      session: freshSession(),
      assets: [],
      decisions: {},
      cursor: 0,
    });
    scheduleSave(get);
  },
}));
