"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, LogOut } from "lucide-react";
import AuthNavActions from "@/components/home/AuthNavActions";
import Header from "@/components/layout/Header";
import { publicNavigation, workspaceNavigation } from "@/config/navigation";
import type { AppRole } from "@/lib/routing";
import { useAuth } from "@/features/auth/AuthProvider";

const primaryHrefs = ["/customer", "/customer/daily-log", "/customer/workouts", "/customer/ai-coach", "/customer/progress"];

export default function AccountShell({ role, children }: { role: AppRole; children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const items = workspaceNavigation[role];
  const primary = role === "CUSTOMER"
    ? primaryHrefs.map((href) => items.find((item) => item.href === href)).filter((item): item is (typeof items)[number] => Boolean(item))
    : items;
  const more = role === "CUSTOMER" ? items.filter((item) => !primaryHrefs.includes(item.href)) : [];

  useEffect(() => {
    const timer = window.setTimeout(() => setMoreOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return <div className="account-shell">
    <a href="#workspace-content" className="skip-link">Skip to content</a>
    <Header links={publicNavigation} actions={<AuthNavActions />} />
    <div className="account-nav-bar">
      <nav className="account-nav" aria-label="Account navigation">
        {primary.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} onClick={() => setMoreOpen(false)} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>{label.replace("My workouts", "Workouts").replace("AI coach", "AI Coach")}</Link>;
        })}
        {more.length > 0 && <div className="account-more" ref={moreRef}>
          <button type="button" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen} aria-haspopup="menu">More <ChevronDown size={15} /></button>
          {moreOpen && <div className="account-more-menu" role="menu">
            <p>More</p>
            <div>{more.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return <Link key={href} href={href} role="menuitem" onClick={() => setMoreOpen(false)} className={active ? "is-active" : ""}><Icon size={17} /><span>{label.replace("My profile", "Profile")}</span><ArrowRight size={14} /></Link>;
            })}</div>
          </div>}
        </div>}
      </nav>
      <button className="account-signout" onClick={() => void logout()}><LogOut size={16} /> Sign out</button>
    </div>
    <main id="workspace-content" className="account-content" tabIndex={-1}>{children}</main>
  </div>;
}
