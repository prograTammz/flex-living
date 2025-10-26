import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const paramsObj = await context.params;
  const id = paramsObj.id;
  const { isPublic } = await req.json().catch(() => ({}));
  console.log("isPublic:", isPublic);
  if (typeof isPublic !== "boolean") {
    return NextResponse.json(
      { error: "isPublic (boolean) is required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("Review")
    .update({ isPublic })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id, isPublic });
}
