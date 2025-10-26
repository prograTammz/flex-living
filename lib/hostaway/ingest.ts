import { supabaseAdmin } from "../supabase/admin";
import { loadListingMap } from "./mapping";
import { retrieveReviews } from "./retrieve";

export const ingestReviews = async () => {
  // 1) fetch + normalize everything you want to process
  const normalized = await retrieveReviews(); // [{ source_id, listingMapId, ... }]

  if (!normalized.length) {
    return { fetched: 0, upserted: 0 };
  }

  // 2) map Hostaway listing IDs to your internal Listing.id
  const idMap = await loadListingMap(); // Map<number, string>

  // 5) Build rows for upsert (deduplicate by sourceId first)
  const seen = new Set<string>();
  const uniqueNormalized = [];
  for (const r of normalized) {
    const key = String(r.sourceId);
    if (seen.has(key)) continue; // skip duplicates
    seen.add(key);
    uniqueNormalized.push(r);
  }

  const rows = uniqueNormalized.map((r) => ({
    ...r,
    listingId:
      r.listingId != null ? idMap.get(Number(r.listingId)) ?? null : null,
  }));

  // 4) upsert by unique source_id
  const { data, error } = await supabaseAdmin
    .from("Review")
    .upsert(rows, { onConflict: "sourceId" })
    .select("sourceId");

  if (error) {
    throw new Error(`Upsert failed: ${error.message}`);
  }

  return {
    fetched: normalized.length,
    upserted: data?.length ?? 0,
  };
};
