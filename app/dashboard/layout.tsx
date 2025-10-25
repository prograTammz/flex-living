import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: replace with real auth guard that checks Supabase session/claims
  return (
    <div>
      <header>Dashboard header (auth guard placeholder)</header>
      <main>{children}</main>
    </div>
  );
}
