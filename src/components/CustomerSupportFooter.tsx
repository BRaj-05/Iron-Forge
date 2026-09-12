"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT_IMAGE_URL } from "@/lib/media";
import { theme } from "@/lib/theme";

const types = [
  { value: "GENERAL_SUPPORT", label: "General issue" },
  { value: "TRAINER_CHANGE", label: "Change trainer" },
  { value: "EQUIPMENT_COMPLAINT", label: "Machine complaint" },
  { value: "EXERCISE_COMPLAINT", label: "Exercise issue" },
  { value: "SESSION_REQUEST", label: "Session request" },
];

export default function CustomerSupportFooter({ relatedSlug }: { relatedSlug?: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "GENERAL_SUPPORT",
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  function openForm(type = "GENERAL_SUPPORT") {
    setForm((current) => ({ ...current, type }));
    setStatus("");
    setOpen(true);
  }

  async function submitRequest() {
    setStatus("");
    const response = await fetch("/api/support-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.type,
        subject: form.subject,
        relatedSlug,
        message: [
          form.message,
          form.name && `Name: ${form.name}`,
          form.phone && `Phone: ${form.phone}`,
          form.email && `Email: ${form.email}`,
        ].filter(Boolean).join("\n"),
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error || "Could not send request.");
      return;
    }
    setForm({ type: "GENERAL_SUPPORT", name: "", phone: "", email: "", subject: "", message: "" });
    setStatus("Request sent to owner.");
  }

  return (
    <>
      <footer style={styles.footer}>
        <div style={styles.contactStrip}>
          <ContactItem mark="A" title="Visit" copy="Delhi NCR, India" />
          <ContactItem mark="P" title="Call" copy="+91 98765 43210" />
          <ContactItem mark="M" title="Mail" copy="support@ironforge.fit" />
        </div>
        <div style={styles.footerGrid}>
          <div>
            <div style={styles.brand}>
              <span style={styles.logoMark}>IF</span>
              <strong>Iron Forge</strong>
            </div>
            <p style={styles.copy}>
              Fitness education, attendance, daily diet, workout tracking,
              payments, trainer requests, and owner support in one place.
            </p>
          </div>
          <div>
            <h4 style={styles.heading}>Useful links</h4>
            <Link href="/customer/dashboard" style={styles.link}>My account</Link>
            <Link href="/customer/payments" style={styles.link}>Membership</Link>
            <button onClick={() => openForm("GENERAL_SUPPORT")} style={styles.linkButton}>Complaint</button>
          </div>
          <div>
            <h4 style={styles.heading}>Support</h4>
            <button onClick={() => openForm("GENERAL_SUPPORT")} style={styles.linkButton}>Contact us</button>
            <button onClick={() => openForm("TRAINER_CHANGE")} style={styles.linkButton}>Change trainer</button>
            <button onClick={() => openForm("EQUIPMENT_COMPLAINT")} style={styles.linkButton}>Register issue</button>
          </div>
        </div>
      </footer>

      {open && (
        <div style={styles.overlay} role="dialog" aria-modal="true">
          <div style={styles.modal}>
            <div style={{ ...styles.modalImage, backgroundImage: `linear-gradient(90deg, rgba(10,10,15,0.82), rgba(10,10,15,0.24)), url(${CONTACT_IMAGE_URL})` }}>
              <span style={styles.modalBadge}>Owner Support</span>
              <h2 style={styles.modalTitle}>Send a request without leaving the page.</h2>
            </div>
            <div style={styles.modalForm}>
              <div style={styles.modalTop}>
                <h3>Contact us</h3>
                <button onClick={() => setOpen(false)} style={styles.closeButton} aria-label="Close complaint form">X</button>
              </div>
              <div style={styles.twoCols}>
                <input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} style={styles.input} />
                <input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} style={styles.input} />
              </div>
              <input placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} style={styles.input} />
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} style={styles.input}>
                {types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              <input placeholder="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} style={styles.input} />
              <textarea placeholder="Please describe the issue or request" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} style={styles.textarea} />
              <button onClick={submitRequest} style={styles.button}>Send message</button>
              {status && <span style={styles.status}>{status}</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ContactItem({ mark, title, copy }: { mark: string; title: string; copy: string }) {
  return (
    <div style={styles.contactItem}>
      <span style={styles.contactMark}>{mark}</span>
      <div>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: { marginTop: 42, background: "#050608", borderTop: `1px solid ${theme.border}` },
  contactStrip: { maxWidth: 1440, margin: "0 auto", padding: "28px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18, borderBottom: `1px solid ${theme.border}` },
  contactItem: { display: "flex", alignItems: "center", gap: 16 },
  contactMark: { width: 58, height: 58, borderRadius: "50%", display: "grid", placeItems: "center", background: theme.gradient, color: "#fff", fontWeight: 950 },
  footerGrid: { maxWidth: 1440, margin: "0 auto", padding: "34px 32px 44px", display: "grid", gridTemplateColumns: "minmax(260px, 1fr) repeat(2, minmax(180px, 0.35fr))", gap: 40 },
  brand: { display: "flex", alignItems: "center", gap: 12, color: theme.textPrimary, fontSize: 22 },
  logoMark: { width: 38, height: 38, borderRadius: 8, display: "grid", placeItems: "center", background: theme.gradient, fontWeight: 950 },
  copy: { color: theme.textSecondary, lineHeight: 1.7, maxWidth: 520, marginTop: 14 },
  heading: { color: "#fff", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 },
  link: { display: "block", color: theme.textSecondary, textDecoration: "none", marginBottom: 11, fontWeight: 800 },
  linkButton: { display: "block", border: "none", background: "transparent", color: theme.textSecondary, padding: "0 0 11px", fontWeight: 800, cursor: "pointer", textAlign: "left" },
  overlay: { position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.72)", display: "grid", placeItems: "center", padding: 20, animation: "ifFadeIn 0.22s ease" },
  modal: { width: "min(980px, 100%)", display: "grid", gridTemplateColumns: "0.95fr 1fr", overflow: "hidden", borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.surface, boxShadow: "0 34px 110px rgba(0,0,0,0.55)", animation: "ifSlideUp 0.28s ease" },
  modalImage: { minHeight: 520, backgroundSize: "cover", backgroundPosition: "center", padding: 34, display: "grid", alignContent: "end" },
  modalBadge: { color: theme.gold, fontSize: 12, textTransform: "uppercase", letterSpacing: 3, fontWeight: 950 },
  modalTitle: { fontSize: 42, lineHeight: 1.02, marginTop: 12 },
  modalForm: { padding: 34, display: "grid", gap: 12 },
  modalTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  closeButton: { width: 36, height: 36, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surfaceAlt, color: theme.textPrimary, cursor: "pointer" },
  twoCols: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  input: { minHeight: 46, border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.surfaceAlt, color: theme.textPrimary, padding: "11px 13px" },
  textarea: { minHeight: 138, border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.surfaceAlt, color: theme.textPrimary, padding: 13, resize: "vertical" },
  button: { minHeight: 48, border: "none", borderRadius: 8, background: theme.gradient, color: "#fff", fontWeight: 950, cursor: "pointer" },
  status: { color: theme.green, fontWeight: 850 },
};
