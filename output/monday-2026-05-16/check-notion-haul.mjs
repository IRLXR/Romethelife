import fs from "fs";

const fetchPath =
  "C:/Users/jerom/.cursor/projects/c-Users-jerom-Downloads-Me-Vs-Me-MevMeCursor/agent-tools/f3ecea2a-74ba-4b6b-a02e-9b6ff735975b.txt";
const raw = fs.readFileSync(fetchPath, "utf8");
const data = JSON.parse(raw);
const text = data.text || "";

for (let i = 1; i <= 5; i++) {
  console.log(`Mon-Eve-${i}:`, text.includes(`Mon-Eve-${i}`));
}
console.log("Haul reveal Rome:", text.includes("Haul reveal — Rome"));
console.log("Mon-Eve-5 stack:", text.includes("stack reveal → worn proof"));
const idx = text.indexOf("6–9 PM · Haul reveal");
console.log("haul section index:", idx);
console.log("text length:", text.length);
