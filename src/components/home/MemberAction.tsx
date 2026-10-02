"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

import { useAuth } from "@/features/auth/AuthProvider";
import { dashboardFor } from "@/lib/routing";

type MemberActionProps = {
  href: string;
  label: string;
  lockedLabel?: string;
};

export default function MemberAction({
  href,
  label,
  lockedLabel = "Login to use this",
}: MemberActionProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const checked = !loading;

  const isCustomer = user?.role === "CUSTOMER";

  return (
    <Button
      type="button"
      variant={isCustomer ? "success" : "primary"}
      disabled={loading}
      onClick={() => router.push(isCustomer ? href : user ? dashboardFor(user.role) : `/login?next=${encodeURIComponent(href)}`)}
      style={{
        padding: "14px 20px",
        opacity: checked ? 1 : 0.72,
      }}
    >
      {loading ? "Loading…" : isCustomer ? label : user ? "Open my dashboard" : lockedLabel}
    </Button>
  );
}
