"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock3, Dumbbell, Flame, Trophy, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeading from "@/components/ui/PageHeading";
import Panel from "@/components/ui/Panel";
import StatCard from "@/components/ui/StatCard";
import { apiRequest } from "@/modules/customer/api";
import { useCustomerDashboard } from "@/modules/customer/useCustomerDashboard";
import type { ExerciseEntry, MealEntry } from "@/modules/customer/types";
import { apiRoutes } from "@/config/api-routes";
import { experienceSlides } from "@/lib/experience-media";

export default function CustomerDashboard() {
  const { data, loading, error, refresh } = useCustomerDashboard();
  async function markAttendance() {
    try { await apiRequest(apiRoutes.customer.checkIn, { method: "POST" }); toast.success("Attendance marked for today."); await refresh(); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not mark attendance."); }
  }
  if (loading) return <DashboardLoading />;
  if (!data) return <Card className="dashboard-error"><h2>We couldn&apos;t open your dashboard.</h2><p>{error}</p><Button onClick={() => void refresh()}>Try again</Button></Card>;

  const firstName = data.user.name.split(" ")[0];
  const checkedIn = data.attendance.some((item) => new Date(item.checkIn).toDateString() === new Date().toDateString());
  const exercises = Array.isArray(data.daily?.workout?.exercises) ? data.daily.workout.exercises as ExerciseEntry[] : [];
  const meals = Array.isArray(data.daily?.diet?.meals) ? data.daily.diet.meals as MealEntry[] : [];
  const completed = [checkedIn, Boolean(data.daily?.workout?.completed), Boolean(data.daily?.diet?.completed)].filter(Boolean).length;
  const membershipTone = data.subscription?.status === "ACTIVE" ? "var(--green)" : "var(--gold)";

  return <div className="dashboard-page">
    <section className="dashboard-welcome-grid">
      <div className="dashboard-welcome-copy">
        <PageHeading eyebrow={new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date())} title={`Welcome back, ${firstName}.`} description="Here’s your training picture for today. One clear next step at a time." action={<Link className="dashboard-primary-link" href="/customer/daily-log">Update today’s log <ArrowRight size={17} /></Link>} />
      </div>
      <Link
        href="/customer/workouts"
        className="dashboard-welcome-visual"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,14,13,.05), rgba(15,14,13,.78)), url(${experienceSlides[0].image})`,
        }}
      >
        <span>Today&apos;s focus</span>
        <strong>Train with purpose.</strong>
        <small>Open your workout plan <ArrowRight size={14} /></small>
      </Link>
    </section>
    {error && <div className="dashboard-inline-error">{error}</div>}
    {(data.subscription?.status === "EXPIRING_SOON" || data.subscription?.status === "EXPIRED") && <Card className="dashboard-membership-alert"><div><strong>{data.subscription.status === "EXPIRED" ? "Your membership has expired" : `${data.subscription.daysRemaining ?? 0} days left on your membership`}</strong><p>Renew to keep your training and trainer access uninterrupted.</p></div><Link href="/plans">View plans <ArrowRight size={16} /></Link></Card>}

    <section className="dashboard-stats" aria-label="Membership summary">
      <StatCard label="Membership" value={data.plan?.name || "No plan"} accent={membershipTone} delta={data.subscription?.status?.replaceAll("_", " ") || "Choose a plan"} icon={<Flame size={20} />} />
      <StatCard label="Check-ins" value={data.attendance.length} accent="var(--accent)" delta={checkedIn ? "You’re checked in today" : "Ready when you are"} icon={<Check size={20} />} />
      <StatCard label="Today’s habits" value={`${completed}/3`} accent="var(--gold)" delta={completed === 3 ? "All done — excellent work" : `${3 - completed} still to complete`} icon={<Trophy size={20} />} />
      <StatCard label="Trainer" value={data.trainer?.name?.split(" ")[0] || "Unassigned"} accent="#8b5cf6" delta={data.trainer?.specialization || "Ask the gym team"} icon={<UserRound size={20} />} />
    </section>

    <Card className="dashboard-panel" style={{ marginBottom: 18 }}><h2>AI Posture Coach</h2><p>Check your movement with real-time pose tracking. Your camera stays in your browser.</p><Link href="/customer/ai-coach" className="dashboard-primary-link">Start AI Coach</Link></Card>

    <section className="dashboard-main-grid">
      <Panel title="Today’s plan" description="Your three essentials for a productive day." action={<span className="dashboard-progress-label">{completed} of 3 complete</span>}>
        <div className="dashboard-progress-track"><span style={{ width: `${completed / 3 * 100}%` }} /></div>
        <div className="dashboard-checklist">
          <DashboardTask done={checkedIn} icon={<Check size={19} />} title="Gym check-in" detail={checkedIn ? "Attendance recorded" : "Mark your arrival at the gym"} action={checkedIn ? undefined : <Button variant="secondary" onClick={() => void markAttendance()}>Check in</Button>} />
          <DashboardTask done={Boolean(data.daily?.workout?.completed)} icon={<Dumbbell size={19} />} title={data.daily?.workout?.workoutName || "Workout log"} detail={exercises.length ? `${exercises.length} exercises planned` : "Add today’s exercises and sets"} href="/customer/daily-log" />
          <DashboardTask done={Boolean(data.daily?.diet?.completed)} icon={<Flame size={19} />} title="Nutrition & water" detail={meals.length ? `${meals.filter((meal) => meal.done).length}/${meals.length} meals · ${data.daily?.diet?.waterCups || 0} cups water` : "Track your meals and hydration"} href="/customer/daily-log" />
        </div>
      </Panel>

      <Panel title="Membership" description="Your current plan and access." action={<Link href="/plans" className="dashboard-text-link">Manage <ArrowRight size={14} /></Link>}>
        <div className="membership-card">
          <span className="membership-status" style={{ color: membershipTone }}>{data.subscription?.status?.replaceAll("_", " ") || "NO ACTIVE PLAN"}</span>
          <strong>{data.plan?.name || "Choose your membership"}</strong>
          <div className="membership-detail"><CalendarDays size={17} /><span>Valid until</span><b>{data.subscription ? new Date(data.subscription.endDate).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" }) : "—"}</b></div>
          <div className="membership-detail"><Clock3 size={17} /><span>Days remaining</span><b>{Math.max(0, data.subscription?.daysRemaining ?? 0)}</b></div>
        </div>
      </Panel>
    </section>

    <section className="dashboard-secondary-grid">
      <Panel title="Recent activity" description="Your latest visits and updates.">
        <div className="activity-list">{data.attendance.slice(0, 4).map((item) => <div className="activity-row" key={item.id}><span className="activity-icon"><Check size={16} /></span><div><strong>Gym check-in</strong><small>{new Date(item.checkIn).toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" })}</small></div><time>{new Date(item.checkIn).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}</time></div>)}{!data.attendance.length && <EmptyState text="Your check-ins will appear here." />}</div>
      </Panel>
      <Panel title="Updates for you" description="Messages from Iron Forge.">
        <div className="activity-list">{data.notifications.slice(0, 4).map((item) => <div className="activity-row" key={item.id}><span className="activity-icon is-orange"><Flame size={16} /></span><div><strong>{item.type.replaceAll("_", " ")}</strong><small>{item.message}</small></div></div>)}{!data.notifications.length && <EmptyState text="You’re all caught up." />}</div>
      </Panel>
    </section>
  </div>;
}

function DashboardTask({ done, icon, title, detail, href, action }: { done: boolean; icon: React.ReactNode; title: string; detail: string; href?: string; action?: React.ReactNode }) {
  const content = <><span className={`dashboard-task-icon ${done ? "is-done" : ""}`}>{done ? <Check size={18} /> : icon}</span><div><strong>{title}</strong><small>{detail}</small></div><span className={`dashboard-task-state ${done ? "is-done" : ""}`}>{done ? "Done" : "To do"}</span>{href && <ArrowRight size={17} />}{action}</>;
  return href ? <Link href={href} className="dashboard-task">{content}</Link> : <div className="dashboard-task">{content}</div>;
}
function EmptyState({ text }: { text: string }) { return <div className="dashboard-empty"><Trophy size={22} /><p>{text}</p></div>; }
function DashboardLoading() { return <div className="dashboard-page" aria-label="Loading dashboard"><div className="skeleton dashboard-title-skeleton" /><div className="dashboard-stats">{[1,2,3,4].map((item) => <div className="skeleton dashboard-card-skeleton" key={item} />)}</div></div>; }
