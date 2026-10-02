"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";

type RequestRow = {
  id: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

const options = [
  { title: "Strength Form Audit", focus: "FORM_CHECK", detail: "Check posture, tempo, and risky reps with your assigned trainer." },
  { title: "Nutrition Review", focus: "DIET", detail: "Ask for diet feedback based on your saved daily food history." },
  { title: "Mobility Reset", focus: "RECOVERY", detail: "Get help when joints feel tight or a movement feels uncomfortable." },
];

export default function CustomerSessionsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(apiRoutes.shared.supportRequests, { cache: "no-store" })
      .then((res) => res.json())
      .then((rows) => setRequests(Array.isArray(rows) ? rows.filter((row) => row.type === "SESSION_REQUEST") : []))
      .catch(() => setRequests([]));
  }, []);

  const latestBySubject = useMemo(() => {
    const map = new Map<string, RequestRow>();
    for (const request of requests) {
      if (!map.has(request.subject)) map.set(request.subject, request);
    }
    return map;
  }, [requests]);

  async function requestSession(title: string, focus: string) {
    if (latestBySubject.get(title)?.status === "OPEN") {
      setMessage("You already have an open request for this slot.");
      return;
    }

    setLoading(true);
    setMessage("");
    const response = await fetch(apiRoutes.shared.supportRequests, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SESSION_REQUEST",
        subject: title,
        message: `Customer requested ${title}. Focus: ${focus}. Preferred timing can be confirmed by owner/trainer.`,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "Could not request session.");
    } else {
      setRequests((prev) => [payload, ...prev]);
      setMessage("Session request saved and sent to owner.");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <Card style={styles.hero}>
        <p style={styles.eyebrow}>TRAINER SESSIONS</p>
        <h1 style={styles.title}>Book focused help from your trainer.</h1>
        <p style={styles.copy}>
          Requests are saved in the database and sent to the owner, so approval
          and trainer follow-up can happen from the admin side.
        </p>
      </Card>
      {message && <Card accent={theme.green} style={styles.message}>{message}</Card>}
      <section style={styles.grid}>
        {options.map((option) => {
          const request = latestBySubject.get(option.title);
          return (
            <Card key={option.title} style={styles.card}>
              <span style={styles.status}>{request?.status || "AVAILABLE"}</span>
              <h2>{option.title}</h2>
              <p>{option.detail}</p>
              <strong>{request ? `Requested ${new Date(request.createdAt).toLocaleString()}` : "No open request"}</strong>
              <Button disabled={loading || request?.status === "OPEN"} onClick={() => requestSession(option.title, option.focus)}>
                {request?.status === "OPEN" ? "Waiting approval" : "Request slot"}
              </Button>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: { padding: 30, marginBottom: 22, background: "linear-gradient(135deg,#111118,#160b05)" },
  eyebrow: { color: theme.accent, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(34px, 5vw, 64px)", lineHeight: 1, maxWidth: 920, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 760 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  card: { padding: 22, display: "grid", gap: 12 },
  status: { color: theme.green, fontWeight: 950, fontSize: 12 },
  message: { background: `${theme.green}12`, color: theme.green, padding: 14, marginBottom: 18 },
};
