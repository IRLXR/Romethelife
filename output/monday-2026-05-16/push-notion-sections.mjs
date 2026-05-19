import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const pageId = "362e1b3e-6009-8186-9dda-ce15242f4b56";

const HAUL_START = "## 6–9 PM · Haul reveal — Rome style (Hero B)";
const HAUL_END = "## Quick pick (one per slot)";

const header =
  '<callout icon="📄" color="blue_bg">\n\tSynced from `output/monday-2026-05-16/` · May 16, 2026 · headings and tables render as normal Notion text (not a code block).\n</callout>\n\n';

const haulPinned =
  '<callout icon="🌙" color="red_bg">\n\t**6–9 PM · Haul reveal (Hero B tracksuit)** — full prompts **start here** (Mon-Eve-1 … Mon-Eve-5). GRWM + 3-ways + swap-ins are below.\n</callout>\n\n';

const prompts = fs.readFileSync(path.join(dir, "prompts.md"), "utf8");
const archive = fs.readFileSync(path.join(dir, "notion-monday-content.md"), "utf8");

const haulStartIdx = prompts.indexOf(HAUL_START);
const quickPickIdx = prompts.indexOf(HAUL_END);
if (haulStartIdx === -1 || quickPickIdx === -1) {
  throw new Error("Could not find haul or quick-pick section in prompts.md");
}

const haulSection = prompts.slice(haulStartIdx, quickPickIdx);
const promptsRest =
  prompts.slice(0, haulStartIdx) + prompts.slice(quickPickIdx);

// Haul first so it is visible without scrolling past AM/PM/swap-ins.
const body =
  header +
  haulPinned +
  haulSection +
  "\n---\n\n" +
  promptsRest +
  "\n\n---\n\n## notion-monday-content.md (archive snapshot — summaries only)\n\n" +
  archive +
  "\n";

const payload = {
  page_id: pageId,
  command: "replace_content",
  new_str: body,
};

fs.writeFileSync(
  path.join(dir, "notion-replace-payload.json"),
  JSON.stringify(payload),
  "utf8"
);

fs.writeFileSync(path.join(dir, "notion-page-body.md"), body, "utf8");
fs.writeFileSync(path.join(dir, "notion-monday-haul.md"), haulSection, "utf8");
console.log("body chars", body.length);
console.log("haul section chars", haulSection.length);
