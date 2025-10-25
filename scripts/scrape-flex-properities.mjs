// scrape-flex-properties.mjs
// Node 18+ (uses global fetch). Run: node scrape-flex-properties.mjs

// ------------- INPUT: paste your 50-listings array here -------------
const LISTINGS = [
  { id: 105585, url: "https://theflex.global/property/105585" },
  { id: 410368, url: "https://theflex.global/property/410368" },
  { id: 142736, url: "https://theflex.global/property/142736" },
  { id: 182153, url: "https://theflex.global/property/182153" },
  { id: 82451, url: "https://theflex.global/property/82451" },
  { id: 92182, url: "https://theflex.global/property/92182" },
  { id: 280927, url: "https://theflex.global/property/280927" },
  { id: 137796, url: "https://theflex.global/property/137796" },
  { id: 128652, url: "https://theflex.global/property/128652" },
  { id: 85974, url: "https://theflex.global/property/85974" },
  { id: 120609, url: "https://theflex.global/property/120609" },
  { id: 186285, url: "https://theflex.global/property/186285" },
  { id: 271609, url: "https://theflex.global/property/271609" },
  { id: 136137, url: "https://theflex.global/property/136137" },
  { id: 146031, url: "https://theflex.global/property/146031" },
  { id: 138376, url: "https://theflex.global/property/138376" },
  { id: 173287, url: "https://theflex.global/property/173287" },
  { id: 221477, url: "https://theflex.global/property/221477" },
  { id: 118758, url: "https://theflex.global/property/118758" },
  { id: 253002, url: "https://theflex.global/property/253002" },
  { id: 84297, url: "https://theflex.global/property/84297" },
  { id: 131185, url: "https://theflex.global/property/131185" },
  { id: 106123, url: "https://theflex.global/property/106123" },
  { id: 86403, url: "https://theflex.global/property/86403" },
  { id: 134561, url: "https://theflex.global/property/134561" },
  { id: 142177, url: "https://theflex.global/property/142177" },
  { id: 184643, url: "https://theflex.global/property/184643" },
  { id: 148313, url: "https://theflex.global/property/148313" },
  { id: 253093, url: "https://theflex.global/property/253093" },
  { id: 163276, url: "https://theflex.global/property/163276" },
  { id: 153736, url: "https://theflex.global/property/153736" },
  { id: 209330, url: "https://theflex.global/property/209330" },
  { id: 179037, url: "https://theflex.global/property/179037" },
  { id: 186125, url: "https://theflex.global/property/186125" },
  { id: 199928, url: "https://theflex.global/property/199928" },
  { id: 139194, url: "https://theflex.global/property/139194" },
  { id: 212689, url: "https://theflex.global/property/212689" },
  { id: 218036, url: "https://theflex.global/property/218036" },
  { id: 106635, url: "https://theflex.global/property/106635" },
  { id: 140195, url: "https://theflex.global/property/140195" },
  { id: 313521, url: "https://theflex.global/property/313521" },
  { id: 381060, url: "https://theflex.global/property/381060" },
  { id: 416752, url: "https://theflex.global/property/416752" },
  { id: 218133, url: "https://theflex.global/property/218133" },
  { id: 119800, url: "https://theflex.global/property/119800" },
  { id: 146631, url: "https://theflex.global/property/146631" },
  { id: 195311, url: "https://theflex.global/property/195311" },
  { id: 279152, url: "https://theflex.global/property/279152" },
  { id: 125687, url: "https://theflex.global/property/125687" },
  { id: 169459, url: "https://theflex.global/property/169459" },
];

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      // polite user-agent header to reduce chance of blocking
      headers: { "User-Agent": "Mozilla/5.0 (compatible; flex-scraper/1.0)" },
      // follow redirects by default
    });
    if (!res.ok) {
      throw new Error(
        `Fetch failed: ${res.status} ${res.statusText} for ${url}`
      );
    }
    return await res.text();
  } catch (err) {
    // rethrow so caller can handle/log
    throw err;
  }
}

// ...existing code...

const fs = await import("fs");
const path = await import("path");

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function csvEscape(val) {
  if (val === null || val === undefined) return "";
  const s = typeof val === "string" ? val : JSON.stringify(val);
  // escape double quotes by doubling them
  return `"${s.replace(/"/g, '""')}"`;
}

async function saveCsv(rows, outPath) {
  const header = [
    "id",
    "title",
    "description",
    "lat",
    "lng",
    "heroPhoto",
    "gallery",
    "beds",
    "bathrooms",
    "guests",
    "isActive",
  ];
  const lines = [header.map(csvEscape).join(",")];
  for (const r of rows) {
    const row = [
      r.id,
      r.title,
      r.description,
      r.lat,
      r.lng,
      r.heroPhoto,
      JSON.stringify(r.gallery || []),
      r.beds,
      r.bathrooms,
      r.guests,
      r.isActive,
    ];
    lines.push(row.map(csvEscape).join(","));
  }
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await fs.promises.writeFile(outPath, lines.join("\n"), "utf8");
}

async function processListing(listing) {
  const html = await fetchHtml(listing.url);
  const scripts = html.split("<script>");
  const json = convertToJson(scripts[11].slice(19, -10));
  const description = scripts[10].slice(23, -12).replace(/\\n/g, "").trim();
  const property = json[3].children[1][3].children[3].property;
  return {
    id: property.id,
    description: description,
    lat: property.lat,
    lng: property.lng,
    title: property.listingName,
    heroPhoto:
      property.images && property.images[0] ? property.images[0].url : "",
    gallery: property.images || [],
    beds: property.totalBedrooms,
    bathrooms: property.totalBathrooms,
    guests: property.guestsAllowed,
    isActive: true,
  };
}

(async () => {
  const results = [];
  const failed = [];
  const OUT_DIR = "./out";
  const CSV_PATH = `${OUT_DIR}/listings.csv`;
  const JSON_PATH = `${OUT_DIR}/listings.json`;

  for (let i = 0; i < LISTINGS.length; i++) {
    const item = LISTINGS[i];
    try {
      console.log(`(${i + 1}/${LISTINGS.length}) fetching ${item.url}`);
      const listingObj = await processListing(item);
      results.push(listingObj);
      console.log(`  OK id=${listingObj.id} title="${listingObj.title}"`);
    } catch (err) {
      console.error(`  ERROR id=${item.id} url=${item.url} ->`, err.message);
      failed.push({ id: item.id, url: item.url, error: String(err) });
    }
    // be polite, small delay to reduce chance of blocking
    await sleep(500);
  }

  // save JSON backup
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  await fs.promises.writeFile(
    JSON_PATH,
    JSON.stringify({ results, failed }, null, 2),
    "utf8"
  );

  // save CSV for Supabase upload
  await saveCsv(results, CSV_PATH);

  console.log(`Done. saved ${results.length} rows to ${CSV_PATH}`);
  if (failed.length)
    console.log(`Failed: ${failed.length} items, see ${JSON_PATH}`);
})();

function convertToJson(input) {
  // Step 1: Parse the outer JSON array
  const outer = JSON.parse(input);

  // Step 2: Get the string inside (at index 1)
  const innerStr = outer[1];

  // Step 3: Remove the "6:" prefix
  const colonIndex = innerStr.indexOf(":");
  if (colonIndex === -1) throw new Error("No prefix label found");
  const jsonPart = innerStr.slice(colonIndex + 1);

  // Step 4: Parse the inner string to real JSON
  const innerJson = JSON.parse(jsonPart);

  return innerJson;
}
