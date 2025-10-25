"use client";
import { useUserRole } from "../hooks/useUserRole";

export default function DashboardPage() {
  const { role, loading, isManager } = useUserRole();

  if (loading) return <p>Loading...</p>;
  if (!isManager) return null;

  return <a href="/dashboard">Go to Dashboard {role}</a>;
}
