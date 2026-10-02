import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageShell from "@/components/home/PublicPageShell";
import {
  getAsanaBySlug,
  getRelatedAsanas,
  getYogaCategory,
  yogaImageForSlot,
  yogaAsanas,
} from "@/lib/yoga-data";

export function generateStaticParams() {
  return yogaAsanas.map((asana) => ({ slug: asana.slug }));
}

export default async function YogaAsanaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const asana = getAsanaBySlug(slug);
  if (!asana) notFound();

  const primaryCategory = getYogaCategory(asana.categories[0]);
  const related = getRelatedAsanas(asana);

  return (
    <PublicPageShell>
      <section className="if-section if-hero">
        <div>
          <p className="if-kicker">{primaryCategory?.name || "Yoga Asana"}</p>
          <h1 className="if-title">{asana.name}</h1>
          <p className="if-copy">
            {asana.sanskritName} - a {asana.difficulty.toLowerCase()} practice
            for {asana.bodyParts.join(", ").toLowerCase()} with clear
            breathing, modifications, and safety notes.
          </p>
          <div className="if-actions">
            <Link href="/yoga" className="if-button-secondary">
              All Yoga
            </Link>
            {primaryCategory && (
              <Link href={`/yoga/${primaryCategory.slug}`} className="if-button-secondary">
                Back To {primaryCategory.name}
              </Link>
            )}
          </div>
        </div>

        <aside className="if-card">
          <div
            style={{
              minHeight: 220,
              margin: "-24px -24px 22px",
              borderRadius: "20px 20px 0 0",
              backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.8)), url(${yogaImageForSlot(asana.imageSlot)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <span className="if-tag">{asana.difficulty}</span>
          <h2>Quick Read</h2>
          <Info label="Sanskrit" value={asana.sanskritName} />
          <Info label="Duration" value={asana.duration} />
          <Info label="Body parts" value={asana.bodyParts.join(", ")} />
          <Info label="Goals" value={asana.goalTags.join(", ")} />
        </aside>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          <Panel title="Benefits" items={asana.benefits} />
          <Panel title="Step-by-step process" items={asana.steps} ordered />
          <Panel title="Who should avoid or modify" items={asana.contraindications} />
          <Panel title="Common mistakes" items={asana.commonMistakes} />
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          <article className="if-card">
            <span className="if-tag">Breath</span>
            <h2>Breathing instructions</h2>
            <p>{asana.breathing}</p>
          </article>

          <article className="if-card">
            <span className="if-tag">Modify</span>
            <h2>Beginner modification</h2>
            <ul style={{ display: "grid", gap: 10, paddingLeft: 18 }}>
              {asana.modifications.map((item) => (
                <li key={item} className="if-muted">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="if-card">
            <span className="if-tag">Progress</span>
            <h2>Advanced variation</h2>
            <p>{asana.advancedVariation}</p>
          </article>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-card">
          <span className="if-tag">Safety Notice</span>
          <h2>General education, not medical treatment.</h2>
          <p>
            Yoga may support movement habits, breathing awareness, flexibility,
            and general wellness. It does not diagnose, treat, or cure medical
            conditions. For pain, injury, pregnancy, hypertension, thyroid
            conditions, diabetes, heart issues, or dizziness, consult a doctor
            and trained instructor.
          </p>
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-card">
          <span className="if-tag">Video Placeholder</span>
          {asana.youtubeId ? (
            <iframe
              title={`${asana.name} video`}
              src={`https://www.youtube.com/embed/${asana.youtubeId}`}
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                border: 0,
                borderRadius: 18,
                marginTop: 16,
              }}
              allowFullScreen
            />
          ) : (
            <div
              style={{
                minHeight: 260,
                borderRadius: 20,
                border: "1px dashed rgba(255,255,255,.22)",
                display: "grid",
                placeItems: "center",
                color: "rgba(241,245,249,.62)",
                marginTop: 16,
                textAlign: "center",
                padding: 24,
              }}
            >
              Connect a YouTube ID later from admin content management.
            </div>
          )}
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <p className="if-kicker">Related Asanas</p>
        <h2 className="if-title-sm">Continue with the same practice goal.</h2>
        <div className="if-grid" style={{ marginTop: 24 }}>
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/yoga/asana/${item.slug}`}
              className="if-card"
              style={{ color: "inherit", textDecoration: "none", padding: 0 }}
            >
              <div
                style={{
                  minHeight: 160,
                  backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.78)), url(${yogaImageForSlot(item.imageSlot)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "20px 20px 0 0",
                }}
              />
              <div style={{ padding: 22 }}>
                <span className="if-tag">{item.difficulty}</span>
                <h3>{item.name}</h3>
                <p>{item.goalTags.join(", ")}</p>
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
    <div style={{ marginTop: 12 }}>
      <strong style={{ display: "block", color: "#FBBF24", fontSize: 12 }}>
        {label}
      </strong>
      <span className="if-muted">{value}</span>
    </div>
  );
}

function Panel({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";

  return (
    <article className="if-card">
      <span className="if-tag">Guide</span>
      <h2>{title}</h2>
      <List style={{ display: "grid", gap: 12, paddingLeft: 20 }}>
        {items.map((item) => (
          <li key={item} className="if-muted">
            {item}
          </li>
        ))}
      </List>
    </article>
  );
}
