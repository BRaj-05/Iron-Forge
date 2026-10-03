"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { dashboardFor } from "@/lib/routing";

export default function AuthNavActions() {
  const { user, loading } = useAuth();
  if (loading) return <span className="if-auth-placeholder" aria-label="Checking session" />;
  return user ? (
    <Link href={dashboardFor(user.role)} className="if-button">My account <ArrowUpRight size={16} /></Link>
  ) : (
    <div className="if-auth-actions">
      <Link href="/login" className="if-nav-signin">Sign in</Link>
      <Link href="/signup" className="if-button">Join the forge <ArrowUpRight size={16} /></Link>
    </div>
  );
}
