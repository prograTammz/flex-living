const fs = require("fs");
const path = require("path");

const inputs = [
  "/Users/ahmedtamer/git/flex-living/public/jsons/hostaway-mock-1.json",
  "/Users/ahmedtamer/git/flex-living/public/jsons/hostaway-mock-2.json",
];

function stripLeadingComment(content) {
  // remove leading lines that start with //
  return content.replace(/^(\/\/.*\r?\n)+/, "");
}

function getLeadingComment(content) {
  const m = content.match(/^(\/\/.*\r?\n)+/);
  return m ? m[0] : "";
}

let totalReviews = 0;

for (const input of inputs) {
  const raw = fs.readFileSync(input, "utf8");
  const leading = getLeadingComment(raw);
  const jsonText = stripLeadingComment(raw);
  let data;
  try {
    data = JSON.parse(jsonText);
  } catch (err) {
    console.error("Failed to parse JSON for", input, err.message);
    process.exit(1);
  }

  if (Array.isArray(data.result)) {
    for (const item of data.result) {
      if (Array.isArray(item.reviewCategory) && item.reviewCategory.length) {
        const sum = item.reviewCategory.reduce(
          (s, c) => s + (Number(c.rating) || 0),
          0
        );
        const avg = sum / item.reviewCategory.length;
        item.rating = Math.max(1, Math.min(10, Math.round(avg)));
      } else {
        // leave rating as-is if no categories
      }
    }
  } else {
    console.warn("Unexpected format, no data.result array in", input);
  }

  const count = Array.isArray(data.result) ? data.result.length : 0;
  totalReviews += count;
  console.log(`${input} -> ${count} review(s)`);
  data.count = count;

  const outPath = input.replace(/\.json$/, ".filled.json");
  const outContent =
    (leading || `// filepath: ${outPath}\n`) +
    JSON.stringify(data, null, 2) +
    "\n";
  fs.writeFileSync(outPath, outContent, "utf8");
  console.log("Wrote filled file:", outPath);
}

console.log(`Total reviews across files: ${totalReviews}`);
