import Link from "next/link";
import PublicPageShell from "@/components/home/PublicPageShell";
import { planCards } from "@/lib/public-content";

const comparison = [
  ["Daily Score", "Yes", "Yes", "Yes", "Yes"],
  ["Workout Missions", "Basic", "Advanced", "Yoga flow", "Full stack"],
  ["Leaderboard", "Yes", "Yes", "No", "Yes"],
  ["Trainer Booking", "Add-on", "Add-on", "Add-on", "Included preview"],
  ["AI Coach", "Preview", "Preview", "Preview", "Premium preview"],
];

export default function PlansPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Membership Plans</p>
        <h1 className="if-title">Plans for gym, yoga, trainer calls, and smarter habits.</h1>
        <p className="if-copy">
          Phase 1 keeps checkout as a preview. Razorpay subscriptions and
          payment verification arrive in the payment phase without breaking
          public browsing.
        </p>
        <div className="if-actions">
          <Link href="/signup" className="if-button">
            Join Now
          </Link>
          <Link href="/contact" className="if-button-secondary">
            Ask For Guidance
          </Link>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {planCards.map((plan) => (
            <article key={plan.name} className="if-card">
              <span className="if-tag">{plan.tag}</span>
              <h2>{plan.name}</h2>
              <strong style={{ color: "#FBBF24", fontSize: 40 }}>
                {plan.price}
              </strong>
              <p style={{ marginTop: 14 }}>{plan.copy}</p>
              <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
                {plan.features.map((feature) => (
                  <span key={feature} className="if-muted">
                    + {feature}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-card">
          <span className="if-tag">Comparison</span>
          <h2>Choose by habit, not by hype.</h2>
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td
                        key={cell}
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid rgba(255,255,255,.08)",
                          color: index === 0 ? "white" : "rgba(241,245,249,.68)",
                          fontWeight: index === 0 ? 900 : 600,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
