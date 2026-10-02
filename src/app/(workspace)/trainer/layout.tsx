import type { ReactNode } from "react";
import AccountShell from "@/components/layout/AccountShell";

export default function TrainerLayout({ children }: { children: ReactNode }) {
  return <AccountShell role="TRAINER">{children}</AccountShell>;
}
