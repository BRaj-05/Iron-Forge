import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0A0A0F", color: "#F1F5F9" }}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}