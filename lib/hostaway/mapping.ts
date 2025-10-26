import { supabaseAdmin } from "../supabase/admin";

export async function loadListingMap(): Promise<Map<number, string>> {
  // assumes your Listing table has hostaway_listing_id (text or int)
  const { data, error } = await supabaseAdmin
    .from("Listing")
    .select("id, hostwayListingId")
    .not("hostwayListingId", "is", null);

  if (error) throw error;

  const map = new Map<number, string>();
  for (const row of data ?? []) {
    const ext = Number(row.hostwayListingId);
    if (!Number.isNaN(ext)) map.set(ext, row.id);
  }
  return map;
}
