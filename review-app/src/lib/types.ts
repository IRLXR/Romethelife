export type MediaKind = 'image' | 'video';

export type AssetSource =
  | { kind: 'url'; href: string }
  | { kind: 'file'; blobId: string; name: string; mime: string };

export type DecisionStatus = 'pending' | 'skipped' | 'liked';

export type StarValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface ElementReference {
  url?: string;
  blobIds?: string[];
  note?: string;
}

export interface ElementReview {
  stars: StarValue;
  ref?: ElementReference;
}

export interface Asset {
  id: string;
  source: AssetSource;
  kind: MediaKind;
  label?: string;
  createdAt: number;
}

export interface Decision {
  assetId: string;
  status: DecisionStatus;
  overallStars: StarValue;
  elements: Record<string, ElementReview>;
  notes?: string;
  decidedAt?: number;
}

export interface CriterionDef {
  id: string;
  label: string;
  hint?: string;
}

export interface ReviewSession {
  id: string;
  name: string;
  createdAt: number;
  criteria: CriterionDef[];
}

export interface ManifestExport {
  version: 1;
  exportedAt: number;
  session: ReviewSession;
  assets: Asset[];
  decisions: Decision[];
}

export const DEFAULT_CRITERIA: CriterionDef[] = [
  { id: 'shirt', label: 'Shirt / wardrobe', hint: 'Graphic, fit, fabric' },
  { id: 'rug', label: 'Rug / floor element', hint: 'Pattern, scale, position' },
  { id: 'lighting', label: 'Lighting', hint: 'Color, glow, mood' },
  { id: 'pose', label: 'Pose / gaze', hint: 'Body language, head angle' },
  { id: 'background', label: 'Room / background', hint: 'Furniture, walls, props' },
];
