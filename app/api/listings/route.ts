import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  // Fetch all Listing, newest first
  const { data, error } = await supabase
    .from("Listing")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ Listing: data }, { status: 200 });
}
