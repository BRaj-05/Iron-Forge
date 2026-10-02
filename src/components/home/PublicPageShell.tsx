import type { ReactNode } from "react";
import AuthNavActions from "@/components/home/AuthNavActions";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { publicNavigation } from "@/config/navigation";

export default function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="if-page">
      <Header links={publicNavigation} actions={<AuthNavActions />} />

      {children}

      <Footer />
    </main>
  );
}
