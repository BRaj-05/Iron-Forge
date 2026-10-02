import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeading from "@/components/ui/PageHeading";
import { weeklySchedule } from "@/modules/customer/schedule";

export default function CustomerCalendarPage() {
  const today = new Intl.DateTimeFormat("en", { weekday: "long" }).format(new Date());
  return <div className="dashboard-page compact-page">
    <PageHeading eyebrow="My gym" title="Weekly calendar" description="See the gym rhythm, plan your training, and request trainer time from one place." action={<Link className="dashboard-primary-link" href="/customer/sessions">Request a session <ArrowRight size={17} /></Link>} />
    <section className="calendar-grid">{weeklySchedule.map((item) => <Card className={`dashboard-panel calendar-day ${item.day === today ? "is-today" : ""}`} key={item.day}><div className="calendar-day-title"><span className="panel-icon"><CalendarDays size={17} /></span><div><strong>{item.day}</strong>{item.day === today && <small>Today</small>}</div></div><div className="calendar-session-list">{item.sessions.map((session) => <span key={session}>{session}</span>)}</div></Card>)}</section>
  </div>;
}
