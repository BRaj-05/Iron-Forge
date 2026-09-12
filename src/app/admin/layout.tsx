"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="ADMIN" />

      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}