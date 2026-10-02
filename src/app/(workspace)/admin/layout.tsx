import type { ReactNode } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <WorkspaceShell role="OWNER">{children}</WorkspaceShell>;
}
