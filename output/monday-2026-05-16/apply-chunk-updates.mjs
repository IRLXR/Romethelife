import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
for (let i = 2; i <= 6; i++) {
  const j = JSON.parse(
    fs.readFileSync(path.join(dir, `chunk-update-${i}.json`), "utf8"),
  );
  fs.writeFileSync(
    path.join(dir, `mcp-call-${i}.json`),
    JSON.stringify({
      page_id: j.page_id,
      command: j.command,
      content_updates: j.content_updates,
    }),
  );
  console.log(`mcp-call-${i}.json`, fs.statSync(path.join(dir, `mcp-call-${i}.json`)).size);
}
