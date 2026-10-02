"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, LogOut, Search, HelpCircle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { workspaceNavigation } from "@/config/navigation";
import { dashboardFor, type AppRole } from "@/lib/routing";
import { useAuth } from "@/features/auth/AuthProvider";

export default function WorkspaceShell({ role, children }: { role: AppRole; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const items = workspaceNavigation[role];
  const active = items.find((item) => item.href === pathname);
  const groups = [...new Set(items.map((item) => item.group))];
  return (
    <div className="workspace">
      <a href="#workspace-content" className="skip-link">Skip to content</a>
      {open && <button className="workspace-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside id="workspace-navigation" className={`workspace-sidebar ${open ? "is-open" : ""}`} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
        <div className="workspace-brand-row">
          <Link href={dashboardFor(role)} className="workspace-brand" onClick={() => setOpen(false)}><Logo size={36} /><span>IRON FORGE<small>{role === "CUSTOMER" ? "MEMBER SPACE" : role === "OWNER" ? "OWNER SPACE" : "TRAINER SPACE"}</small></span></Link>
          <button className="workspace-close icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav aria-label="Workspace navigation" className="workspace-navigation">
          {groups.map((group) => <div className="workspace-nav-group" key={group}>
            <p>{group}</p>
            {items.filter((item) => item.group === group).map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined} className={`workspace-nav-link ${pathname === href ? "is-active" : ""}`}><Icon size={18} strokeWidth={1.7} /><span>{label}</span>{pathname === href && <span className="workspace-active-dot" />}</Link>)}
          </div>)}
        </nav>
        <div className="workspace-sidebar-bottom">
          <Link href="/gym" className="workspace-library"><DumbbellMark /><span>Keep learning<small>Explore the exercise library</small></span><ArrowUpRight size={16} /></Link>
          <button onClick={() => void logout()} className="workspace-nav-link"><LogOut size={18} />Sign out</button>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-topbar">
          <div className="workspace-breadcrumb"><button className="workspace-menu icon-button" onClick={() => setOpen(!open)} aria-label="Open navigation" aria-expanded={open} aria-controls="workspace-navigation"><Menu size={21} /></button><span>My workspace</span><span className="workspace-separator">/</span><strong>{active?.label || "Overview"}</strong></div>
          <div className="workspace-top-actions"><Link href="/gym" className="workspace-search"><Search size={16} /><span>Explore exercises</span></Link><Link href="/contact" className="icon-button" aria-label="Get help"><HelpCircle size={19} /></Link><Link href={role === "CUSTOMER" ? "/customer/profile" : dashboardFor(role)} className="workspace-avatar" aria-label="My account">{user?.name?.slice(0, 1).toUpperCase() || "IF"}</Link></div>
        </header>
        <main id="workspace-content" className="workspace-content" tabIndex={-1}>{children}</main>
        <footer className="workspace-footer">
          <div><strong>IRON FORGE</strong><span>A little stronger, every day.</span></div>
          <nav aria-label="Member footer">
            <Link href="/gym">Exercise library</Link>
            {role === "CUSTOMER" && <Link href="/customer/profile">My profile</Link>}
            <Link href="/contact">Get support <ArrowUpRight size={14} /></Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}

function DumbbellMark() { return <span className="workspace-library-mark">IF</span>; }
