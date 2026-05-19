# Review · Swipe

Browser-only, Tinder-style reviewer for images and videos. Drop assets in, swipe like or skip, then rate the overall result and each element you care about. Each criterion can carry a replacement reference (a URL or files you drag in) so you have one place that says: "this part was wrong, here's what to use instead."

## Run it

```bash
cd review-app
npm install
npm run dev
```

Open the printed URL (default http://127.0.0.1:5173).

## Bring assets in

The left sidebar has three intake paths. All three can be mixed in the same session.

- Paste one or more URLs into the textarea and click Add URLs.
- Drag image or video files (or whole folders, in Chromium) onto the dropzone, or click it to browse.
- Click Pick folder to use the File System Access API where available.

The supported types are detected by mime (for files) and extension (for URLs): `png`, `jpg`, `jpeg`, `gif`, `webp`, `avif`, `bmp`, `svg`, `mp4`, `webm`, `mov`, `m4v`, `ogg`. Other items are ignored silently.

## Review

- Swipe right or press `→` / `Space` / `L` to like.
- Swipe left or press `←` to skip.
- `↑` / `↓` move through the queue without changing decisions.
- `U` resets the current asset back to pending.
- Click Remove to permanently drop an asset and its stored blob.

When you like an asset the side panel unlocks: set the overall star rating, then go through each criterion and score it, optionally attaching a replacement reference. Open the modal with Expand rating for a larger layout.

## Criteria

The sidebar shows the per-session criteria checklist. Defaults are `Shirt`, `Rug`, `Lighting`, `Pose`, `Background`. Rename them, add new ones (Enter to save), or remove ones you don't need. The change applies to the active session only.

## Persistence

Everything lives in your browser:

- Decisions, criteria, and the session name go into IndexedDB under the `kv` store.
- Uploaded files and replacement references are stored as blobs under the `blobs` store.

That means the data survives refresh and restart, but it does not move between browsers or machines on its own. Use Export manifest to dump a portable JSON. Use Import manifest to bring it back in the same browser. JSON manifests carry decisions and URL references exactly, and they reference local blobs by id; the blobs themselves only persist in the IndexedDB they were saved into, so re-importing on another device will list the rows but show empty file previews for those.

For the gallery, you can also Export CSV with one row per liked asset, including the per-element star ratings and any reference URLs or notes you wrote down. That CSV is useful for handing back to a generation pipeline.

## Caveats

- Some CDN URLs block hot-linking; if you see a broken thumbnail, download the file and drop it in.
- Folder picker only works in Chromium-based browsers (Chrome, Edge, Arc, Brave). Firefox and Safari fall back to file picking and drag-drop.
- Videos preview muted by default to keep autoplay policies happy. Click the video to toggle controls.
- Be mindful of disk: large videos eat IndexedDB quota. The Reset button in the sidebar clears the entire session and frees all blobs.

## Stack

- Vite + React 18 + TypeScript.
- `zustand` for the in-memory store.
- `idb` for IndexedDB access.
- Plain CSS variables for the theme (light + dark via `prefers-color-scheme`).

No telemetry, no remote calls, no service workers. Refresh-safe by design.
