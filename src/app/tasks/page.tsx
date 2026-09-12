import PublicPageShell from "@/components/home/PublicPageShell";
import MemberAction from "@/components/home/MemberAction";
import { taskPreview } from "@/lib/public-content";

const lanes = [
  "Strength mission",
  "Cardio finisher",
  "Yoga mobility",
  "Meal guard",
  "Water target",
  "Recovery note",
];

export default function TasksPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero">
        <div>
          <p className="if-kicker">Workout Tasks</p>
          <h1 className="if-title">Fitness tasks should feel useful, not noisy.</h1>
          <p className="if-copy">
            Iron Forge missions combine workout blocks, yoga, cardio, meals,
            water, and recovery into visible XP. Members know what matters
            today before they drift.
          </p>
          <div className="if-actions">
            <MemberAction
              href="/customer/todos"
              label="Open My Tasks"
              lockedLabel="Login to complete tasks"
            />
          </div>
        </div>

        <aside className="if-card if-float">
          <span className="if-tag">Today Stack</span>
          <div style={{ display: "grid", gap: 10 }}>
            {lanes.map((lane, index) => (
              <div key={lane} className="if-row" style={{ gridTemplateColumns: "auto 1fr" }}>
                <span className="if-badge">{index + 1}</span>
                <strong>{lane}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {taskPreview.map((task) => (
            <article key={task.title} className="if-card">
              <span className="if-tag">{task.goal}</span>
              <h2>{task.title}</h2>
              <p>{task.note}</p>
              <strong style={{ color: "#FBBF24", fontSize: 28 }}>
                +{task.xp} XP
              </strong>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
