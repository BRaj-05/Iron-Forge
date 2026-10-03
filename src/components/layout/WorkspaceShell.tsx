"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Search, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { publicNavigation, workspaceNavigation } from "@/config/navigation";
import { dashboardFor, type AppRole } from "@/lib/routing";
import { useAuth } from "@/features/auth/AuthProvider";

export default function WorkspaceShell({ role, children }: { role: AppRole; children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const items = workspaceNavigation[role];

  useEffect(() => {
    setWorkspaceOpen(false);
  }, [pathname]);

  useEffect(() => {
    function closeOnOutside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setWorkspaceOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setWorkspaceOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="workspace-unified">
      <a href="#workspace-content" className="skip-link">Skip to content</a>

      <Header
        links={publicNavigation}
        actions={
          <div className="workspace-header-actions">
            <Link href="/gym" className="workspace-header-search" aria-label="Explore exercises">
              <Search size={16} />
              <span>Explore</span>
            </Link>

            <div className="workspace-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className={`workspace-menu-trigger ${workspaceOpen ? "is-open" : ""}`}
                aria-expanded={workspaceOpen}
                aria-haspopup="menu"
                onClick={() => setWorkspaceOpen((value) => !value)}
              >
                <Sparkles size={16} />
                <span>Workspace</span>
                <ChevronDown size={14} />
              </button>

              {workspaceOpen && (
                <div className="workspace-role-menu" role="menu" aria-label="Workspace tools">
                  <div className="workspace-role-menu-head">
                    <div>
                      <small>Signed in as</small>
                      <strong>{user?.name || "Iron Forge"}</strong>
                    </div>
                    <Link href={dashboardFor(role)} onClick={() => setWorkspaceOpen(false)}>
                      Open overview
                    </Link>
                  </div>

                  <div className="workspace-role-menu-grid">
                    {items.map(({ label, href, icon: Icon }) => {
                      const selected = pathname === href || pathname.startsWith(`${href}/`);
                      return (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          className={`workspace-role-item ${selected ? "is-active" : ""}`}
                          onClick={() => setWorkspaceOpen(false)}
                        >
                          <Icon size={17} />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="workspace-role-signout"
                    onClick={() => void logout()}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      <main id="workspace-content" className="workspace-content unified-workspace-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="workspace-footer unified-workspace-footer">
        <div><strong>IRON FORGE</strong><span>A little stronger, every day.</span></div>
        <nav aria-label="Workspace footer">
          <Link href="/gym">Exercise library</Link>
          <Link href={dashboardFor(role)}>My workspace</Link>
          <Link href="/contact">Get support</Link>
        </nav>
      </footer>
    </div>
  );
}
