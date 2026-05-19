import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const files = ["prompts.md", "notion-monday-content.md"];

let body =
  '<callout icon="📄" color="blue_bg">\n\t**Raw markdown** synced from repo · May 16, 2026 · Source: `output/monday-2026-05-16/`\n</callout>\n';

for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  body += `\n## ${f}\n\n\`\`\`markdown\n${text}\n\`\`\`\n`;
}

const payload = {
  page_id: "362e1b3e-6009-8186-9dda-ce15242f4b56",
  command: "replace_content",
  new_str: body,
};

const out = path.join(dir, "notion-replace-payload.json");
fs.writeFileSync(out, JSON.stringify(payload), "utf8");
console.log("wrote", out, "bytes", fs.statSync(out).size);
