// lib/auth/requireManager.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies as nextCookies } from "next/headers";

export async function requireManager() {
  const cookieStore = nextCookies(); // 1) get the store
  const supabase = createRouteHandlerClient({
    // 2) pass a function
    cookies: () => cookieStore,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  if (profile?.role !== "manager") throw new Error("Forbidden");

  return supabase; // return an authenticated server client
}
