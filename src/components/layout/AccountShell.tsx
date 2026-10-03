"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { publicNavigation, workspaceNavigation } from "@/config/navigation";
import { dashboardFor, type AppRole } from "@/lib/routing";
import { useAuth } from "@/features/auth/AuthProvider";

export default function AccountShell({ role, children }: { role: AppRole; children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const items = workspaceNavigation[role];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="account-shell unified-account-shell">
      <a href="#workspace-content" className="skip-link">Skip to content</a>

      <Header
        links={publicNavigation}
        actions={
          <div className="workspace-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className={`workspace-menu-trigger ${open ? "is-open" : ""}`}
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-haspopup="menu"
            >
              <Sparkles size={16} />
              <span>Workspace</span>
              <ChevronDown size={14} />
            </button>

            {open && (
              <div className="workspace-role-menu" role="menu" aria-label="Workspace tools">
                <div className="workspace-role-menu-head">
                  <div>
                    <small>Signed in as</small>
                    <strong>{user?.name || "Iron Forge"}</strong>
                  </div>
                  <Link href={dashboardFor(role)} onClick={() => setOpen(false)}>
                    Open overview
                  </Link>
                </div>

                <div className="workspace-role-menu-grid">
                  {items.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(`${href}/`);
                    return (
                      <Link
                        key={href}
                        href={href}
                        role="menuitem"
                        className={`workspace-role-item ${active ? "is-active" : ""}`}
                        onClick={() => setOpen(false)}
                      >
                        <Icon size={17} />
                        <span>
                          {label
                            .replace("My workouts", "Workouts")
                            .replace("AI coach", "AI Coach")
                            .replace("My profile", "Profile")}
                        </span>
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
        }
      />

      <main id="workspace-content" className="account-content unified-account-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
