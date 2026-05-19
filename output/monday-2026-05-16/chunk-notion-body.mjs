import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const body = fs.readFileSync(path.join(dir, "notion-page-body.md"), "utf8");
const marker = "<!--NOTION_CHUNK_SPLIT-->";
const max = 7500;
const chunks = [];
let i = 0;
while (i < body.length) {
  let end = Math.min(i + max, body.length);
  if (end < body.length) {
    const nl = body.lastIndexOf("\n", end);
    if (nl > i) end = nl + 1;
  }
  chunks.push(body.slice(i, end));
  i = end;
}
fs.writeFileSync(
  path.join(dir, "notion-body-chunks.json"),
  JSON.stringify(chunks),
  "utf8"
);
console.log("chunks", chunks.length, "sizes", chunks.map((c) => c.length).join(","));
