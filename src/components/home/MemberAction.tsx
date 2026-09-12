"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthUser = {
  id?: string;
  role?: "ADMIN" | "CUSTOMER";
};

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/protected", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data?.user || null);
        setChecked(true);
      })
      .catch(() => {
        setUser(null);
        setChecked(true);
      });
  }, []);

  const isCustomer = user?.role === "CUSTOMER";

  return (
    <button
      type="button"
      onClick={() => router.push(isCustomer ? href : "/login")}
      style={{
        border: "none",
        borderRadius: 12,
        background: isCustomer
          ? "linear-gradient(135deg,#22C55E,#059669)"
          : "linear-gradient(135deg,#F97316,#EF4444)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 900,
        padding: "14px 20px",
        boxShadow: isCustomer
          ? "0 14px 34px rgba(34,197,94,0.2)"
          : "0 14px 34px rgba(249,115,22,0.2)",
        opacity: checked ? 1 : 0.72,
      }}
    >
      {checked && isCustomer ? label : lockedLabel}
    </button>
  );
}
