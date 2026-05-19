import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
let t = fs.readFileSync(path.join(dir, "prompts.md"), "utf8");
t = t.replace(/^# Sunday prompts[^\n]*\n\n/, "");

const header = `<callout icon="📄" color="blue_bg">
\t**Sunday · full prompts** · May 16, 2026 · Repo: \`output/sunday-2026-05-16/prompts.md\` · Normal text (not a code block).
</callout>
<callout icon="👤" color="gray_bg">
\t**Rome (on-camera):** masculine Black man, teal-tipped bun, half-lidded, **no smile**, nonchalant—relaxed jaw, unbothered, slow movement, old-money ease, never timid or cutesy.
</callout>
**Quick picks:** Sun-S2-AM-1 · Sun-PM-1 · Sun-W-Eve-1
---
`;

t = t.replace(/^# (Sunday[^\n]+)$/gm, "## $1");
t = t.replace(/^### (Sun-[^\n]+)$/gm, "### $1 {toggle=\"true\"}");

const lines = t.split("\n");
const out = [];
let inToggle = false;
for (const line of lines) {
  if (/^## /.test(line)) {
    inToggle = false;
    out.push(line);
    continue;
  }
  if (/^### Sun-/.test(line)) {
    inToggle = true;
    out.push(line);
    continue;
  }
  if (inToggle && line.trim() !== "" && line !== "---") {
    out.push(line.startsWith("\t") ? line : "\t" + line);
  } else {
    if (line === "---") inToggle = false;
    out.push(line);
  }
}

const body = header + out.join("\n");
fs.writeFileSync(path.join(dir, "notion-sunday-body.md"), body, "utf8");
console.log("chars", body.length);
