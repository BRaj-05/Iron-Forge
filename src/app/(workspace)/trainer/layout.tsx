import type { ReactNode } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";

export default function TrainerLayout({ children }: { children: ReactNode }) {
  return <WorkspaceShell role="TRAINER">{children}</WorkspaceShell>;
}
