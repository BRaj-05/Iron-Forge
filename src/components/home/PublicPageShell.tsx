import type { ReactNode } from "react";
import Link from "next/link";
import AuthNavActions from "@/components/home/AuthNavActions";
import { publicNavLinks } from "@/lib/public-content";

const footerGroups = [
  {
    title: "Learn",
    links: [
      { label: "Equipment", href: "/equipment" },
      { label: "Daily Score", href: "/daily-score" },
      { label: "Tasks", href: "/tasks" },
      { label: "Plans", href: "/plans" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Member Login", href: "/login" },
      { label: "Join Now", href: "/signup" },
    ],
  },
];

export default function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="if-page">
      <header className="if-nav">
        <Link href="/" className="if-logo" aria-label="Iron Forge home">
          <span className="if-logo-mark">IF</span>
          <span className="if-logo-text">Iron Forge</span>
        </Link>

        <nav className="if-nav-links" aria-label="Public navigation">
          {publicNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="if-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <AuthNavActions />
      </header>

      {children}

      <footer className="if-footer">
        <div className="if-footer-brand">
          <span className="if-logo-mark">IF</span>
          <div>
            <h3>Iron Forge</h3>
            <p>
              Fitness education, gym operations, yoga, nutrition habits,
              Cloudinary media, attendance, XP, rankings, and memberships in
              one focused platform.
            </p>
          </div>
        </div>

        <div className="if-footer-grid">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div>
            <h4>Contact</h4>
            <p>Delhi NCR, India</p>
            <p>support@ironforge.fit</p>
            <p>+91 98765 43210</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
