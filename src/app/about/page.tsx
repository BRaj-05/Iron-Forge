import PublicPageShell from "@/components/home/PublicPageShell";

const principles = [
  {
    title: "Education before intensity",
    copy: "A new member should understand the machine, the muscle, the mistake, and the safer alternative before chasing weight.",
  },
  {
    title: "Business control for admins",
    copy: "Admin manages people, payments, attendance, media, memberships, analytics, and future content libraries from one operating layer.",
  },
  {
    title: "Habits members can see",
    copy: "XP, streaks, score, meals, tasks, and rank turn invisible consistency into something members can actually follow.",
  },
];

export default function AboutPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">About Iron Forge</p>
        <h1 className="if-title">
          A gym platform should teach, track, and operate.
        </h1>
        <p className="if-copy">
          Iron Forge is evolving from gym management into a complete fitness
          education platform: gym exercises, yoga, cardio, nutrition habits,
          trainer sessions, Cloudinary media, and admin analytics in one
          focused system.
        </p>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {principles.map((item) => (
            <article key={item.title} className="if-card">
              <span className="if-tag">Principle</span>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
