"use client";

import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function TrainerLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="TRAINER" />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
