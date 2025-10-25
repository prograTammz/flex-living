// Run: node scripts/add-columns-to-csv.mjs

import fs from "fs/promises";
import path from "path";

const GooglePlaceIds = [
  "ChIJ55r9eaYcdkgRc9BAZwm4PkQ",
  "ChIJ4Rrc9aYcdkgR5q33Wb0Tq2M",
  "ChIJh0NtW68cdkgR40n0-BYWewQ",
  "ChIJ_086eDMbdkgRJZ9YIIL80LM",
  "ChIJ9ZdKfK4cdkgRvcHeMdST-so",
  "ChIJK6_-wFgbdkgRLFv6-m1kB8k",
  "ChIJqU5BMpscdkgRjIsXFQFsZzQ",
  "ChIJGSogDagddkgRVRxFuyCbXBg",
  "ChIJNY6JC9MddkgRMXreL1vY2WU",
  "ChIJ00V6pt4bdkgRDvBPEtJp33g",
];

// mapping from insert-missing-columns.mjs
const idsMap = [
  { listingMapId: 1, hostwayListingId: 105585 },
  { listingMapId: 2, hostwayListingId: 410368 },
  { listingMapId: 3, hostwayListingId: 142736 },
  { listingMapId: 4, hostwayListingId: 182153 },
  { listingMapId: 5, hostwayListingId: 82451 },
  { listingMapId: 6, hostwayListingId: 92182 },
  { listingMapId: 7, hostwayListingId: 280927 },
  { listingMapId: 8, hostwayListingId: 137796 },
  { listingMapId: 9, hostwayListingId: 128652 },
  { listingMapId: 10, hostwayListingId: 85974 },
  { listingMapId: 11, hostwayListingId: 120609 },
  { listingMapId: 12, hostwayListingId: 186285 },
  { listingMapId: 13, hostwayListingId: 271609 },
  { listingMapId: 14, hostwayListingId: 136137 },
  { listingMapId: 15, hostwayListingId: 146031 },
  { listingMapId: 16, hostwayListingId: 138376 },
  { listingMapId: 17, hostwayListingId: 173287 },
  { listingMapId: 18, hostwayListingId: 221477 },
  { listingMapId: 19, hostwayListingId: 118758 },
  { listingMapId: 20, hostwayListingId: 253002 },
  { listingMapId: 21, hostwayListingId: 84297 },
  { listingMapId: 22, hostwayListingId: 131185 },
  { listingMapId: 23, hostwayListingId: 106123 },
  { listingMapId: 24, hostwayListingId: 86403 },
  { listingMapId: 25, hostwayListingId: 134561 },
  { listingMapId: 26, hostwayListingId: 184643 },
  { listingMapId: 27, hostwayListingId: 148313 },
  { listingMapId: 28, hostwayListingId: 253093 },
  { listingMapId: 29, hostwayListingId: 153736 },
  { listingMapId: 30, hostwayListingId: 209330 },
  { listingMapId: 31, hostwayListingId: 179037 },
  { listingMapId: 32, hostwayListingId: 199928 },
  { listingMapId: 33, hostwayListingId: 139194 },
  { listingMapId: 34, hostwayListingId: 212689 },
  { listingMapId: 35, hostwayListingId: 218036 },
  { listingMapId: 36, hostwayListingId: 106635 },
  { listingMapId: 37, hostwayListingId: 140195 },
  { listingMapId: 38, hostwayListingId: 313521 },
  { listingMapId: 39, hostwayListingId: 381060 },
  { listingMapId: 40, hostwayListingId: 416752 },
  { listingMapId: 41, hostwayListingId: 218133 },
  { listingMapId: 42, hostwayListingId: 119800 },
  { listingMapId: 43, hostwayListingId: 146631 },
  { listingMapId: 44, hostwayListingId: 195311 },
  { listingMapId: 45, hostwayListingId: 279152 },
  { listingMapId: 46, hostwayListingId: 125687 },
  { listingMapId: 47, hostwayListingId: 169459 },
];

function csvEscape(val) {
  if (val === null || val === undefined) return "";
  const s = typeof val === "string" ? val : String(val);
  return `"${s.replace(/"/g, '""')}"`;
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

(async function main() {
  const IN = path.join("out", "listings.csv");
  const OUT = path.join("out", "listings-with-mapping.csv");
  const BACKUP = path.join("out", "listings-with-mapping.json");

  const raw = await fs.readFile(IN, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) throw new Error("Empty CSV");

  const header = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((l) => parseCsvLine(l));

  const idIndex = header.findIndex((h) => h.replace(/"/g, "").trim() === "id");
  if (idIndex === -1) throw new Error("id column not found in CSV");

  // Build quick lookup by hostwayListingId
  const mapByHostway = new Map(
    idsMap.map((m) => [String(m.hostwayListingId), m])
  );

  // new headers appended
  const newHeader = [...header, "hostwayListingId", "googlePlaceId"];

  const outRows = rows.map((cols, idx) => {
    const idRaw = cols[idIndex];
    const id = idRaw === "" ? "" : idRaw;
    const mapped = mapByHostway.get(id.replace(/"/g, "").trim());
    // hostwayListingId should equal the CSV id when mapping exists; otherwise empty
    const hostwayListingId = mapped ? mapped.listingMapId : "";
    // assign same googlePlaceId for groups of 10 (0-9 => GooglePlaceIds[0], 10-19 => GooglePlaceIds[1], ...)
    // assign per-row so rows 0..9 use GooglePlaceIds[0..9], rows 10..19 repeat 0..9, etc.
    const pos = idx % GooglePlaceIds.length;
    const googlePlaceId = GooglePlaceIds[pos] || "";

    return [...cols, String(hostwayListingId), googlePlaceId];
  });

  // write CSV
  const csvLines = [newHeader.map(csvEscape).join(",")].concat(
    outRows.map((r) => r.map(csvEscape).join(","))
  );
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, csvLines.join("\n"), "utf8");

  // write JSON backup
  const json = outRows.map((r) => {
    const obj = {};
    newHeader.forEach((h, i) => {
      obj[h.replace(/"/g, "")] = r[i];
    });
    return obj;
  });
  await fs.writeFile(BACKUP, JSON.stringify({ rows: json }, null, 2), "utf8");

  console.log(`Wrote ${outRows.length} rows to ${OUT} and backup ${BACKUP}`);
})().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
