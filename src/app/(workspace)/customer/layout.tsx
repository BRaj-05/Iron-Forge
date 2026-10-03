import type { ReactNode } from "react";
import AccountShell from "@/components/layout/AccountShell";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <AccountShell role="CUSTOMER">{children}</AccountShell>;
}
