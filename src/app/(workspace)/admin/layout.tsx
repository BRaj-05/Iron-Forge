import type { ReactNode } from "react";
import AccountShell from "@/components/layout/AccountShell";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AccountShell role="OWNER">{children}</AccountShell>;
}
