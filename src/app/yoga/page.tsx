import Link from "next/link";
import PublicPageShell from "@/components/home/PublicPageShell";
import { yogaAsanas, yogaCategories, yogaImageForSlot } from "@/lib/yoga-data";

export default function YogaPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Yoga Library</p>
        <h1 className="if-title">Move better without turning wellness into a false promise.</h1>
        <p className="if-copy">
          Explore yoga by flexibility, posture, stress relief, back support,
          beginner practice, and gentle wellness categories. Medical-condition
          pages use careful language and always point members toward qualified
          guidance.
        </p>
        <div className="if-actions">
          <Link href="/yoga/beginner" className="if-button">
            Start Beginner Yoga
          </Link>
          <Link href="/yoga/flexibility" className="if-button-secondary">
            Flexibility Flow
          </Link>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {yogaCategories.map((category) => {
            const count = yogaAsanas.filter((asana) =>
              asana.categories.includes(category.slug),
            ).length;

            return (
              <Link
                key={category.slug}
                href={`/yoga/${category.slug}`}
                className="if-card"
                style={{ color: "inherit", textDecoration: "none", padding: 0 }}
              >
                <div
                  style={{
                    minHeight: 210,
                    backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.72)), url(${yogaImageForSlot(category.imageSlot)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "20px 20px 0 0",
                  }}
                />
                <div style={{ padding: 24 }}>
                  <span className="if-tag">{count} asanas</span>
                  <h2>{category.name}</h2>
                  <p>{category.focus}</p>
                  <div style={{ marginTop: 18 }}>
                    <strong style={{ color: "#FBBF24", fontSize: 12 }}>
                      Body focus
                    </strong>
                    <p className="if-muted">{category.bodyParts.join(", ")}</p>
                  </div>
                  <p className="if-muted" style={{ marginTop: 14 }}>
                    {category.safetyNote}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PublicPageShell>
  );
}
