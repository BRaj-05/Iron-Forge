import PublicPageShell from "@/components/home/PublicPageShell";
import FadeInSection from "@/components/motion/FadeInSection";
import Card from "@/components/ui/Card";
import { prisma } from "@/infrastructure/prisma/client";
import { theme } from "@/lib/theme";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots = [
  { time: "6:00 AM", type: "Strength Basics" },
  { time: "8:00 AM", type: "Yoga Mobility" },
  { time: "6:00 PM", type: "Cardio Conditioning" },
  { time: "8:00 PM", type: "Form Review" },
];

export default async function SchedulePage() {
  const trainers = await prisma.user.findMany({
    where: { role: "TRAINER", isActive: true },
    select: { name: true, specialization: true },
    orderBy: { name: "asc" },
  });

  function trainerFor(index: number) {
    const trainer = trainers[index % Math.max(trainers.length, 1)];
    return trainer?.name || "Trainer pending";
  }

  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Classes Schedule</p>
        <h1 className="if-title">A weekly rhythm members can scan fast.</h1>
        <p className="if-copy">
          This timetable uses real active trainer names when available. Class
          slots are seeded as a simple operating schedule until a full class
          model is added.
        </p>
      </section>

      <FadeInSection className="if-section" style={{ paddingTop: 0 }}>
        <Card style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.head}>Time</th>
                {days.map((day) => <th key={day} style={styles.head}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, rowIndex) => (
                <tr key={slot.time}>
                  <th style={styles.time}>{slot.time}</th>
                  {days.map((day, colIndex) => (
                    <td key={`${slot.time}-${day}`} style={styles.cell}>
                      <strong style={styles.className}>{slot.type}</strong>
                      <span style={styles.trainerName}>{trainerFor(rowIndex + colIndex)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </FadeInSection>
    </PublicPageShell>
  );
}

const styles: Record<string, React.CSSProperties> = {
  table: { width: "100%", minWidth: 980, borderCollapse: "collapse" },
  head: { padding: 14, background: theme.accent, color: "#fff", textAlign: "left" },
  time: { padding: 14, borderBottom: `1px solid ${theme.border}`, color: theme.gold, textAlign: "left" },
  cell: { padding: 14, borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, verticalAlign: "top" },
  className: { display: "block", color: theme.textPrimary, lineHeight: 1.45, marginBottom: 6 },
  trainerName: { display: "block", color: theme.textSecondary, lineHeight: 1.45 },
};
