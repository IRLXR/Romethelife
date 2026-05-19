import { useCallback, useRef, useState } from 'react';
import { useReview } from '../store/useReview';

export function IntakePanel() {
  const addUrlAssets = useReview((s) => s.addUrlAssets);
  const addFileAssets = useReview((s) => s.addFileAssets);
  const [urls, setUrls] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitUrls = useCallback(() => {
    const list = urls
      .split(/\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!list.length) return;
    addUrlAssets(list);
    setUrls('');
  }, [urls, addUrlAssets]);

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const files: File[] = [];
      const items = e.dataTransfer.items;
      if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          if (it.kind === 'file') {
            const f = it.getAsFile();
            if (f) files.push(f);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          files.push(e.dataTransfer.files[i]);
        }
      }
      const text = e.dataTransfer.getData('text/plain');
      if (text) {
        const urlList = text.split(/\s+/).filter(Boolean);
        if (urlList.length) addUrlAssets(urlList);
      }
      if (files.length) await addFileAssets(files);
    },
    [addFileAssets, addUrlAssets],
  );

  const onPickFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list?.length) return;
      const files: File[] = [];
      for (let i = 0; i < list.length; i++) files.push(list[i]);
      await addFileAssets(files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [addFileAssets],
  );

  const pickDirectory = useCallback(async () => {
    const w = window as typeof window & {
      showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
    };
    if (!w.showDirectoryPicker) {
      alert('Folder picker is only supported in Chromium-based browsers. Drag a folder in instead.');
      return;
    }
    try {
      const dir = await w.showDirectoryPicker();
      const collected: File[] = [];
      // Recursive walk, bounded to keep things responsive
      async function walk(handle: FileSystemDirectoryHandle, depth: number) {
        if (depth > 4) return;
        for await (const entry of (handle as unknown as AsyncIterable<FileSystemHandle>)) {
          if (entry.kind === 'file') {
            const fh = entry as FileSystemFileHandle;
            const f = await fh.getFile();
            if (f.type.startsWith('image/') || f.type.startsWith('video/')) {
              collected.push(f);
            }
          } else if (entry.kind === 'directory') {
            await walk(entry as FileSystemDirectoryHandle, depth + 1);
          }
        }
      }
      await walk(dir, 0);
      if (!collected.length) {
        alert('No images or videos found in that folder.');
        return;
      }
      await addFileAssets(collected);
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        alert(`Folder pick failed: ${(err as Error).message}`);
      }
    }
  }, [addFileAssets]);

  return (
    <div className="intake">
      <textarea
        placeholder="Paste image / video URLs, one per line"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <div className="row">
        <button type="button" className="btn primary" onClick={submitUrls} disabled={!urls.trim()}>
          Add URLs
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Pick files
        </button>
        <button type="button" className="btn" onClick={pickDirectory}>
          Pick folder
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={onPickFiles}
      />
      <div
        className={`dropzone ${dragOver ? 'is-dragover' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        Drag files or URLs here, or click to browse
      </div>
    </div>
  );
}
