import { Activity, BarChart3, Dumbbell, Salad } from "lucide-react";
import PublicPageShell from "@/components/home/PublicPageShell";
import FadeInSection from "@/components/motion/FadeInSection";
import { CountUp } from "@/components/motion/CountUp";
import Card from "@/components/ui/Card";
import { prisma } from "@/infrastructure/prisma/client";
import { theme } from "@/lib/theme";

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

const choiceCards = [
  { title: "Attendance Tracking", copy: "Daily check-ins become visible consistency.", icon: Activity },
  { title: "Trainer Guidance", copy: "Assigned trainers can review logs before helping.", icon: Dumbbell },
  { title: "Diet Logging", copy: "Meals, water, and notes stay connected to progress.", icon: Salad },
  { title: "Progress Analytics", copy: "XP, body metrics, streaks, and charts stay readable.", icon: BarChart3 },
];

async function getAboutStats() {
  const [customers, trainers, attendance, workouts, diets] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER", isActive: true } }),
    prisma.user.count({ where: { role: "TRAINER", isActive: true } }),
    prisma.attendance.count(),
    prisma.dailyWorkoutLog.count({ where: { completed: true } }),
    prisma.dailyDietLog.count({ where: { completed: true } }),
  ]);

  const expectedWeekCheckins = Math.max(customers * 7, 1);
  const averageConsistency = Math.min(100, Math.round((attendance / expectedWeekCheckins) * 100));
  const totalCompletionRows = workouts + diets;
  const goalCompletionRate = totalCompletionRows ? 100 : 0;

  return [
    { label: "Average member consistency", value: averageConsistency, suffix: "%", note: "Real: attendance rows versus a 7-day member target" },
    { label: "Goal completion rate", value: goalCompletionRate, suffix: "%", note: "Real: completed workout/diet logs currently saved" },
    { label: "Active trainers", value: trainers, suffix: "", note: "Real: active trainer accounts in the database" },
  ];
}

export default async function AboutPage() {
  const stats = await getAboutStats();

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
            <Card key={item.title}>
              <span className="if-tag">Principle</span>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <FadeInSection className="if-section" style={{ paddingTop: 0 }}>
        <p className="if-kicker">Why choose us</p>
        <h2 className="if-title-sm">The system is built around the habits a member actually repeats.</h2>
        <div className="if-grid" style={{ marginTop: 24 }}>
          {choiceCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <span style={styles.icon}><Icon size={22} /></span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Card>
            );
          })}
        </div>
      </FadeInSection>

      <FadeInSection className="if-section" style={{ paddingTop: 0 }}>
        <p className="if-kicker">Platform numbers</p>
        <h2 className="if-title-sm">Real operating signals from the current database.</h2>
        <div style={styles.statGrid}>
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div style={styles.statHead}>
                <span>{stat.label}</span>
                <strong><CountUp value={stat.value} suffix={stat.suffix} /></strong>
              </div>
              <div style={styles.track}>
                <div style={{ ...styles.fill, width: stat.suffix === "%" ? `${stat.value}%` : `${Math.min(100, stat.value * 20)}%` }} />
              </div>
              <p className="if-muted">{stat.note}</p>
            </Card>
          ))}
        </div>
      </FadeInSection>
    </PublicPageShell>
  );
}

const styles: Record<string, React.CSSProperties> = {
  icon: {
    width: 46,
    height: 46,
    display: "grid",
    placeItems: "center",
    borderRadius: 10,
    background: "rgba(249,115,22,0.16)",
    color: theme.accent,
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
  statHead: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "baseline",
    marginBottom: 14,
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    background: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    background: theme.gradient,
    transition: "width 800ms ease",
  },
};
