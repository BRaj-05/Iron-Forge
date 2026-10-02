import type { ReactNode } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <WorkspaceShell role="CUSTOMER">{children}</WorkspaceShell>;
}
