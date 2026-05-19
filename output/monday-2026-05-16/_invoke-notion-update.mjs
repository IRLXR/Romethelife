import fs from 'fs';
const args = JSON.parse(
  fs.readFileSync(
    new URL('./notion-mcp-args.json', import.meta.url),
    'utf8',
  ),
);
// Emit arguments JSON on stdout for MCP caller
process.stdout.write(JSON.stringify(args));
