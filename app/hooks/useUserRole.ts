"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useUserRole() {
  const supabase = createClientComponentClient();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadRole = async () => {
      setLoading(true);

      // 🔑 get session (includes user)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setRole(null);
        setLoading(false);
        return;
      }

      const user = session?.user;
      if (!user) {
        if (!ignore) {
          setRole(null);
          setLoading(false);
        }
        return;
      }

      // 🔑 fetch role from profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.error("Failed to load role:", error.message);
          setRole(null);
        } else {
          setRole(profile?.role ?? null);
        }
        setLoading(false);
      }
    };

    loadRole();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  return { role, loading, isManager: role === "manager" };
}
