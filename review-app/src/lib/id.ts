export function makeId(prefix = ''): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return prefix ? `${prefix}_${time}${rand}` : `${time}${rand}`;
}

export function classifyMime(mime: string): 'image' | 'video' | 'other' {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'other';
}

export function classifyUrl(href: string): 'image' | 'video' | 'other' {
  const lower = href.split('?')[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|avif|bmp|svg)$/.test(lower)) return 'image';
  if (/\.(mp4|webm|mov|m4v|ogg)$/.test(lower)) return 'video';
  return 'other';
}
