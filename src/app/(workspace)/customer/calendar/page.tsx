import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Dumbbell, Sparkles } from "lucide-react";
import { weeklySchedule } from "@/modules/customer/schedule";
import { experienceSlides } from "@/lib/experience-media";

export default function CustomerCalendarPage() {
  const today = new Intl.DateTimeFormat("en", { weekday: "long" }).format(new Date());
  return (
    <div className="calendar-premium-page">
      <section
        className="calendar-premium-hero"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(8,9,12,.95), rgba(8,9,12,.68) 58%, rgba(8,9,12,.34)), url(" +
            experienceSlides[1].image +
            ")",
        }}
      >
        <div>
          <p className="if-kicker">Weekly rhythm</p>
          <h1>Plan the week before the week plans you.</h1>
          <p>See training, recovery and trainer sessions in one visual schedule.</p>
          <Link href="/customer/sessions">Request a session <ArrowRight size={16} /></Link>
        </div>
        <aside className="calendar-hero-card">
          <span>Today</span>
          <strong>{today}</strong>
          <small>Keep the next session simple and intentional.</small>
        </aside>
      </section>

      <section className="calendar-strip" aria-label="Weekly schedule">
        {weeklySchedule.map((item, index) => {
          const isToday = item.day === today;
          return (
            <article className={"calendar-modern-day " + (isToday ? "is-today" : "")} key={item.day}>
              <header>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{item.day}</h2>
                </div>
                {isToday && <b>Today</b>}
              </header>
              <div className="calendar-modern-sessions">
                {item.sessions.map((session) => {
                  const [time, label] = session.split(" · ");
                  return (
                    <div key={session}>
                      <span className="calendar-session-icon">
                        {label?.toLowerCase().includes("yoga") || label?.toLowerCase().includes("recovery")
                          ? <Sparkles size={15} />
                          : <Dumbbell size={15} />}
                      </span>
                      <div>
                        <small><Clock3 size={12} /> {time}</small>
                        <strong>{label || session}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
