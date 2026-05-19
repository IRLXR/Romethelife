import type { Decision, ReviewSession, Asset } from './types';

function escape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildLikedCsv(
  session: ReviewSession,
  assets: Asset[],
  decisions: Record<string, Decision>,
): string {
  const liked = assets.filter((a) => decisions[a.id]?.status === 'liked');
  const criterionIds = session.criteria.map((c) => c.id);
  const header = [
    'asset_id',
    'label',
    'source',
    'overall',
    ...criterionIds.flatMap((id) => [`${id}_stars`, `${id}_ref`, `${id}_note`]),
    'notes',
  ];
  const rows: string[] = [header.map(escape).join(',')];
  for (const a of liked) {
    const d = decisions[a.id];
    const source =
      a.source.kind === 'url' ? a.source.href : `[file:${a.source.name}]`;
    const cells: string[] = [
      a.id,
      a.label ?? '',
      source,
      String(d.overallStars ?? 0),
    ];
    for (const cid of criterionIds) {
      const el = d.elements[cid];
      cells.push(String(el?.stars ?? 0));
      const refParts: string[] = [];
      if (el?.ref?.url) refParts.push(el.ref.url);
      if (el?.ref?.blobIds?.length) refParts.push(`[${el.ref.blobIds.length} attached file(s)]`);
      cells.push(refParts.join(' | '));
      cells.push(el?.ref?.note ?? '');
    }
    cells.push(d.notes ?? '');
    rows.push(cells.map(escape).join(','));
  }
  return rows.join('\n');
}
