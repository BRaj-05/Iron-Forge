"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { workspaceNavigation } from "@/config/navigation";
import { dashboardFor, type AppRole } from "@/lib/routing";
import { useAuth } from "@/features/auth/AuthProvider";

const customerPrimaryHrefs = [
  "/customer",
  "/customer/daily-log",
  "/customer/workouts",
  "/customer/ai-coach",
  "/customer/progress",
];

export default function WorkspaceShell({ role, children }: { role: AppRole; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, logout } = useAuth();
  const items = workspaceNavigation[role];
  const active = items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const groups = [...new Set(items.map((item) => item.group))];
  const isCustomer = role === "CUSTOMER";
  const primaryItems = isCustomer
    ? customerPrimaryHrefs
        .map((href) => items.find((item) => item.href === href))
        .filter((item): item is (typeof items)[number] => Boolean(item))
    : [];
  const overflowItems = isCustomer
    ? items.filter((item) => !customerPrimaryHrefs.includes(item.href))
    : [];

  function closeNavigation() {
    setOpen(false);
    setMoreOpen(false);
  }

  return (
    <div className={`workspace ${isCustomer ? "is-customer" : ""}`}>
      <a href="#workspace-content" className="skip-link">Skip to content</a>

      {open && (
        <button
          className="workspace-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="workspace-navigation"
        className={`workspace-sidebar ${open ? "is-open" : ""}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <div className="workspace-brand-row">
          <Link href={dashboardFor(role)} className="workspace-brand" onClick={closeNavigation}>
            <Logo size={36} />
            <span>
              IRON FORGE
              <small>
                {role === "CUSTOMER"
                  ? "MEMBER SPACE"
                  : role === "OWNER"
                    ? "OWNER SPACE"
                    : "TRAINER SPACE"}
              </small>
            </span>
          </Link>
          <button
            className="workspace-close icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Workspace navigation" className="workspace-navigation">
          {groups.map((group) => (
            <div className="workspace-nav-group" key={group}>
              <p>{group}</p>
              {items
                .filter((item) => item.group === group)
                .map(({ label, href, icon: Icon }) => {
                  const selected = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeNavigation}
                      aria-current={selected ? "page" : undefined}
                      className={`workspace-nav-link ${selected ? "is-active" : ""}`}
                    >
                      <Icon size={18} strokeWidth={1.7} />
                      <span>{label}</span>
                      {selected && <span className="workspace-active-dot" />}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="workspace-sidebar-bottom">
          <Link href="/gym" className="workspace-library" onClick={closeNavigation}>
            <DumbbellMark />
            <span>
              Keep learning
              <small>Explore the exercise library</small>
            </span>
            <ArrowUpRight size={16} />
          </Link>
          <button onClick={() => void logout()} className="workspace-nav-link">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="workspace-body">
        <header className={`workspace-topbar ${isCustomer ? "customer-topbar" : ""}`}>
          {isCustomer ? (
            <>
              <div className="customer-header-left">
                <button
                  className="workspace-menu icon-button"
                  onClick={() => setOpen(!open)}
                  aria-label="Open navigation"
                  aria-expanded={open}
                  aria-controls="workspace-navigation"
                >
                  <Menu size={21} />
                </button>

                <Link href="/customer" className="customer-header-brand" aria-label="Iron Forge member home">
                  <Logo size={34} />
                  <span>IRON FORGE<small>MEMBER SPACE</small></span>
                </Link>
              </div>

              <nav className="customer-header-nav" aria-label="Member navigation">
                {primaryItems.map(({ href, label, icon: Icon }) => {
                  const selected = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`customer-header-link ${selected ? "is-active" : ""}`}
                      aria-current={selected ? "page" : undefined}
                    >
                      <Icon size={15} />
                      <span>{label}</span>
                    </Link>
                  );
                })}

                <div className="customer-more-wrap">
                  <button
                    type="button"
                    className={`customer-header-link customer-more-button ${moreOpen ? "is-active" : ""}`}
                    onClick={() => setMoreOpen((value) => !value)}
                    aria-expanded={moreOpen}
                  >
                    <span>More</span>
                    <ChevronDown size={14} />
                  </button>

                  {moreOpen && (
                    <div className="customer-more-menu">
                      <div className="customer-more-track">
                        {overflowItems.map(({ href, label, icon: Icon }) => {
                          const selected = pathname === href || pathname.startsWith(`${href}/`);
                          return (
                            <Link
                              key={href}
                              href={href}
                              className={`customer-more-item ${selected ? "is-active" : ""}`}
                              onClick={() => setMoreOpen(false)}
                            >
                              <Icon size={17} />
                              <span>{label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </>
          ) : (
            <div className="workspace-breadcrumb">
              <button
                className="workspace-menu icon-button"
                onClick={() => setOpen(!open)}
                aria-label="Open navigation"
                aria-expanded={open}
                aria-controls="workspace-navigation"
              >
                <Menu size={21} />
              </button>
              <span>My workspace</span>
              <span className="workspace-separator">/</span>
              <strong>{active?.label || "Overview"}</strong>
            </div>
          )}

          <div className="workspace-top-actions">
            <Link href="/gym" className="workspace-search">
              <Search size={16} />
              <span>Explore exercises</span>
            </Link>
            <Link href="/contact" className="icon-button" aria-label="Get help">
              <HelpCircle size={19} />
            </Link>
            <Link
              href={isCustomer ? "/customer/profile" : dashboardFor(role)}
              className="workspace-avatar"
              aria-label="My account"
            >
              {user?.name?.slice(0, 1).toUpperCase() || "IF"}
            </Link>
          </div>
        </header>

        <main id="workspace-content" className="workspace-content" tabIndex={-1}>
          {children}
        </main>

        <footer className="workspace-footer">
          <div>
            <strong>IRON FORGE</strong>
            <span>A little stronger, every day.</span>
          </div>
          <nav aria-label="Member footer">
            <Link href="/gym">Exercise library</Link>
            {isCustomer && <Link href="/customer/profile">My profile</Link>}
            <Link href="/contact">Get support <ArrowUpRight size={14} /></Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}

function DumbbellMark() {
  return <span className="workspace-library-mark">IF</span>;
}
