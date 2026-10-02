import PublicPageShell from "@/components/home/PublicPageShell";
import { Input } from "@/components/ui/FormField";

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
              <Input
                key={field}
                label={field}
                disabled
                placeholder="Form backend comes in a later phase"
              />
            ))}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
