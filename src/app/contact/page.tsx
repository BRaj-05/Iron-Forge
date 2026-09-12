import PublicPageShell from "@/components/home/PublicPageShell";

const fields = [
  "Name",
  "Phone or email",
  "Goal: gym, yoga, trainer, or membership",
  "Preferred time",
];

export default function ContactPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero">
        <div>
          <p className="if-kicker">Contact</p>
          <h1 className="if-title">Tell us what you want to build or become.</h1>
          <p className="if-copy">
            Use this page as the future lead capture flow for gym memberships,
            yoga plans, trainer calls, and business inquiries.
          </p>
        </div>

        <aside className="if-card">
          <span className="if-tag">Delhi NCR</span>
          <h2>Iron Forge Desk</h2>
          <p>support@ironforge.fit</p>
          <p>+91 98765 43210</p>
          <p>Response window: 10 AM - 7 PM</p>
        </aside>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-card">
          <span className="if-tag">Inquiry Form Preview</span>
          <div className="if-grid" style={{ marginTop: 18 }}>
            {fields.map((field) => (
              <label key={field} style={{ display: "grid", gap: 8 }}>
                <span className="if-muted">{field}</span>
                <input
                  disabled
                  placeholder="Form backend comes in a later phase"
                  style={{
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 14,
                    background: "rgba(255,255,255,.05)",
                    color: "white",
                    padding: "14px 16px",
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
