import PublicPageShell from "@/components/home/PublicPageShell";
import MemberAction from "@/components/home/MemberAction";
import { rankPreview } from "@/lib/public-content";

export default function RankPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero">
        <div>
          <p className="if-kicker">Leaderboard</p>
          <h1 className="if-title">Rank rewards consistency, not just heavy lifting.</h1>
          <p className="if-copy">
            XP, levels, streaks, and completed missions create friendly
            pressure. The best member is often the one who keeps showing up.
          </p>
          <div className="if-actions">
            <MemberAction
              href="/customer/leaderboard"
              label="Open Live Leaderboard"
              lockedLabel="Login to view your rank"
            />
          </div>
        </div>

        <aside className="if-card">
          <span className="if-tag">Weekly Board</span>
          <div style={{ display: "grid", gap: 12 }}>
            {rankPreview.slice(0, 3).map((user, index) => (
              <div key={user.name} className="if-row">
                <span className="if-badge">{index + 1}</span>
                <div>
                  <strong>{user.name}</strong>
                  <p className="if-muted">
                    Level {user.level} - {user.streak} - {user.tag}
                  </p>
                </div>
                <strong style={{ color: "#FBBF24" }}>{user.xp}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {rankPreview.map((user, index) => (
            <article key={user.name} className="if-card">
              <span className="if-tag">Rank {index + 1}</span>
              <h2>{user.name}</h2>
              <p>
                Level {user.level}, {user.streak} streak, strongest category:
                {" "}{user.tag}.
              </p>
              <strong style={{ color: "#FBBF24", fontSize: 30 }}>
                {user.xp} XP
              </strong>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
