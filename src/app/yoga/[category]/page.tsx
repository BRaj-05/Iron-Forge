import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageShell from "@/components/home/PublicPageShell";
import {
  getAsanasByCategory,
  getYogaCategory,
  yogaImageForSlot,
  yogaCategories,
} from "@/lib/yoga-data";

export function generateStaticParams() {
  return yogaCategories.map((category) => ({ category: category.slug }));
}

export default async function YogaCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getYogaCategory(categorySlug);
  if (!category) notFound();

  const asanas = getAsanasByCategory(category.slug);

  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">{category.name}</p>
        <h1 className="if-title">{category.name} asanas with safety-first guidance.</h1>
        <p className="if-copy">{category.focus}</p>
        <p className="if-muted" style={{ marginTop: 18, maxWidth: 760 }}>
          {category.safetyNote}
        </p>
        <div className="if-actions">
          <Link href="/yoga" className="if-button-secondary">
            All Yoga Categories
          </Link>
          {asanas[0] && (
            <Link href={`/yoga/asana/${asanas[0].slug}`} className="if-button">
              Learn First Asana
            </Link>
          )}
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          {asanas.map((asana) => (
            <Link
              key={asana.slug}
              href={`/yoga/asana/${asana.slug}`}
              className="if-card"
              style={{ color: "inherit", textDecoration: "none", padding: 0 }}
            >
              <div
                style={{
                  minHeight: 220,
                  backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.78)), url(${yogaImageForSlot(asana.imageSlot)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "20px 20px 0 0",
                }}
              />
              <div style={{ padding: 24 }}>
                <span className="if-tag">{asana.difficulty}</span>
                <h2>{asana.name}</h2>
                <p className="if-muted">{asana.sanskritName}</p>
                <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                  <Info label="Goal" value={asana.goalTags.join(", ")} />
                  <Info label="Body" value={asana.bodyParts.join(", ")} />
                  <Info label="Duration" value={asana.duration} />
                  <Info label="Safety" value={asana.contraindications[0]} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong style={{ display: "block", color: "#FBBF24", fontSize: 12 }}>
        {label}
      </strong>
      <span className="if-muted">{value}</span>
    </div>
  );
}
