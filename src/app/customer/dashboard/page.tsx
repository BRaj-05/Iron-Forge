"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { theme } from "@/lib/theme";

type User = { id: string; name: string; email: string; phone?: string | null; photoUrl?: string | null };
type Plan = { name: string; price: number; durationDays: number } | null;
type Subscription = { status: string; endDate: string; daysRemaining?: number } | null;
type Attendance = { id: string; checkIn: string; checkOut?: string | null };
type Payment = { id: string; amount: number; method: string; status: string; createdAt: string };
type Notification = { id: string; type: string; message: string; isRead: boolean };
type Trainer = { name: string; email: string; specialization?: string | null; photoUrl?: string | null } | null;

type DashboardData = {
  user: User;
  plan: Plan;
  subscription: Subscription;
  attendance: Attendance[];
  payments: Payment[];
  notifications: Notification[];
  trainer: Trainer;
};

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function CustomerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    setError("");
    try {
      const response = await fetch("/api/dashboard/customer", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load dashboard.");
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function uploadPhoto(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const payload = await response.json();
    if (!response.ok) setError(payload.error || "Photo upload failed.");
    await loadData();
    setUploading(false);
  }

  if (loading) return <main style={styles.page}>Loading your member dashboard...</main>;
  if (error && !data) return <main style={styles.page}><div style={styles.error}>{error}</div></main>;
  if (!data) return null;

  const showBanner = data.subscription?.status === "EXPIRING_SOON" || data.subscription?.status === "EXPIRED";

  return (
    <main style={styles.page}>
      {showBanner && (
        <section style={styles.banner}>
          <strong>{data.subscription?.status === "EXPIRED" ? "Membership expired" : "Membership expiring soon"}</strong>
          <span>
            {data.subscription?.status === "EXPIRED"
              ? "Renew your plan to keep attendance and trainer access active."
              : `${data.subscription?.daysRemaining ?? 0} days remaining. Renew early to avoid interruption.`}
          </span>
          <a href="/plans" style={styles.bannerLink}>Renew</a>
        </section>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.hero}>
        <div style={styles.profile}>
          {data.user.photoUrl ? (
            <Image src={data.user.photoUrl} alt="" width={72} height={72} unoptimized style={styles.avatar} />
          ) : (
            <span style={styles.avatar}>{initials(data.user.name)}</span>
          )}
          <div>
            <p style={styles.eyebrow}>CUSTOMER</p>
            <h1 style={styles.title}>{data.user.name}</h1>
            <p style={styles.muted}>{data.user.email}</p>
          </div>
        </div>
        <label style={styles.uploadButton}>
          {uploading ? "Uploading..." : "Update photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadPhoto(file);
            }}
          />
        </label>
      </section>

      <section style={styles.stats}>
        <Stat label="Plan" value={data.plan?.name || "No active plan"} />
        <Stat label="Status" value={data.subscription?.status || "NONE"} />
        <Stat label="Ends" value={data.subscription ? new Date(data.subscription.endDate).toLocaleDateString() : "Not set"} />
        <Stat label="Check-ins" value={data.attendance.length} />
      </section>

      <section style={styles.grid}>
        <Panel title="Trainer">
          {data.trainer ? (
            <div style={styles.list}>
              <strong>{data.trainer.name}</strong>
              <span>{data.trainer.specialization || "General training"}</span>
              <span>{data.trainer.email}</span>
            </div>
          ) : <span style={styles.muted}>No trainer assigned yet.</span>}
        </Panel>

        <Panel title="Recent attendance">
          <div style={styles.list}>
            {data.attendance.length ? data.attendance.slice(0, 8).map((item) => (
              <span key={item.id}>{new Date(item.checkIn).toLocaleString()}</span>
            )) : <span style={styles.muted}>No check-ins yet.</span>}
          </div>
        </Panel>

        <Panel title="Payments">
          <div style={styles.list}>
            {data.payments.length ? data.payments.slice(0, 8).map((item) => (
              <span key={item.id}>{item.status} - ${item.amount} - {item.method}</span>
            )) : <span style={styles.muted}>No payments yet.</span>}
          </div>
        </Panel>

        <Panel title="Notifications">
          <div style={styles.list}>
            {data.notifications.length ? data.notifications.map((item) => (
              <span key={item.id}>{item.message}</span>
            )) : <span style={styles.muted}>No notifications.</span>}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>{title}</h2>
      {children}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "clamp(18px, 3vw, 32px)", color: theme.textPrimary },
  banner: { border: `1px solid ${theme.gold}`, background: `${theme.gold}14`, borderRadius: 10, padding: 16, marginBottom: 18, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  bannerLink: { color: theme.gold, fontWeight: 900, marginLeft: "auto" },
  error: { border: `1px solid ${theme.danger}`, background: `${theme.danger}12`, color: theme.danger, borderRadius: 10, padding: 12, marginBottom: 18 },
  hero: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 22, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", marginBottom: 18 },
  profile: { display: "flex", gap: 16, alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", display: "grid", placeItems: "center", background: theme.gradient, color: "#fff", fontWeight: 900, fontSize: 22 },
  eyebrow: { color: theme.accent, fontSize: 12, letterSpacing: 2, fontWeight: 900 },
  title: { margin: "4px 0", fontSize: 38 },
  muted: { color: theme.textSecondary },
  uploadButton: { border: `1px solid ${theme.border}`, borderRadius: 8, padding: "11px 14px", cursor: "pointer", color: theme.textPrimary, background: theme.surfaceAlt, fontWeight: 900 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 18 },
  stat: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 18, display: "grid", gap: 8 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 },
  panel: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 18 },
  panelTitle: { margin: "0 0 14px", fontSize: 22 },
  list: { display: "grid", gap: 8, color: theme.textSecondary },
};
