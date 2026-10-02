import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/features/auth/AuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Iron Forge — Make progress every day", template: "%s | Iron Forge" },
  description: "Your training, nutrition, and progress. Together in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0A0A0F", color: "#F1F5F9" }}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
