"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Camera,
  Mail,
  MapPin,
  Play,
  Phone,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export type FooterAction = (type?: string) => void;

const footerColumns = [
  {
    title: "Train",
    links: [
      { label: "Exercise library", href: "/gym" },
      { label: "Cardio programs", href: "/cardio" },
      { label: "Yoga & recovery", href: "/yoga" },
      { label: "Nutrition", href: "/nutrition" },
    ],
  },
  {
    title: "Iron Forge",
    links: [
      { label: "About the gym", href: "/about" },
      { label: "Equipment", href: "/equipment" },
      { label: "Our team", href: "/team" },
      { label: "Memberships", href: "/plans" },
    ],
  },
  {
    title: "Members",
    links: [
      { label: "My account", href: "/dashboard" },
      { label: "Daily score", href: "/daily-score" },
      { label: "Leaderboard", href: "/rank" },
      { label: "Get support", href: "/contact" },
    ],
  },
] as const;

export default function Footer({ onSupport }: { onSupport?: FooterAction }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-ridge" aria-hidden="true" />

      <div className="site-footer-contact">
        <Contact href="tel:+919876543210" icon={<Phone />} label="Call the front desk" value="+91 98765 43210" />
        <Contact href="mailto:support@ironforge.fit" icon={<Mail />} label="Write to us" value="support@ironforge.fit" />
        <Contact href="/contact" icon={<MapPin />} label="Train with us" value="Delhi NCR, India" />
      </div>

      <div className="site-footer-main">
        <section className="site-footer-intro">
          <Link href="/" className="site-footer-brand">
            <Logo size={46} />
            <span><strong>IRON FORGE</strong><small>TRAIN WITH PURPOSE</small></span>
          </Link>
          <p>
            One place to learn movement, plan training, track progress, and stay
            connected with your gym.
          </p>
          <div className="site-footer-socials">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera /></a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Play /></a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Users /></a>
          </div>
        </section>

        <nav className="site-footer-links" aria-label="Footer navigation">
          {footerColumns.map((column) => (
            <section key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </section>
          ))}
        </nav>

        <section className="site-footer-cta">
          <p className="if-kicker">Ready when you are</p>
          <h2>Build your strongest routine.</h2>
          <p>Open your member space or create an account to start tracking.</p>
          <Link href="/signup" className="if-button">Join Iron Forge <ArrowUpRight size={17} /></Link>
          {onSupport && (
            <Button variant="ghost" onClick={() => onSupport("GENERAL_SUPPORT")} className="site-footer-support">
              Send a support request
            </Button>
          )}
        </section>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Iron Forge. All rights reserved.</span>
        <div><Link href="/contact">Contact</Link><Link href="/plans">Membership</Link><Link href="/dashboard">Member portal</Link></div>
      </div>
    </footer>
  );
}

function Contact({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Link href={href} className="site-footer-contact-item">
      <span>{icon}</span>
      <div><small>{label}</small><strong>{value}</strong></div>
    </Link>
  );
}
