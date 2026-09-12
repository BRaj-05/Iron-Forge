"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface Todo {
  _id: string;
  title: string;
  deadline?: string;
  priority: Priority;
  completed: boolean;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: true;
  priority: Priority;
  completed: boolean;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const priorityMeta: Record<Priority, { color: string; xp: number }> = {
  LOW: { color: "var(--green)", xp: 5 },
  MEDIUM: { color: "var(--gold)", xp: 10 },
  HIGH: { color: "var(--accent)", xp: 20 },
  CRITICAL: { color: "var(--danger)", xp: 40 },
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load calendar.");
        }

        const mapped = (data as Todo[])
          .filter((todo) => todo.deadline)
          .map((todo) => ({
            title: `${todo.title} (+${priorityMeta[todo.priority]?.xp || 10} XP)`,
            start: new Date(todo.deadline as string),
            end: new Date(todo.deadline as string),
            allDay: true as const,
            priority: todo.priority,
            completed: todo.completed,
          }));

        setEvents(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = useMemo(
    () =>
      events
        .filter((event) => event.start >= new Date())
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 4),
    [events],
  );

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return events.filter((event) => event.start.toDateString() === today).length;
  }, [events]);

  return (
    <div style={{ padding: 32 }}>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <p
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: 4,
            marginBottom: 6,
          }}
        >
          SCHEDULE
        </p>
        <h1
          style={{
            color: "var(--text-primary)",
            fontSize: 48,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          WORKOUT CALENDAR
        </h1>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <GlowCard accent="var(--accent)">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {Object.entries(priorityMeta).map(([label, meta]) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: meta.color,
                    boxShadow: `0 0 14px ${meta.color}`,
                  }}
                />
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: 1,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>

        <GlowCard accent="var(--green)">
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            Today&apos;s Missions
          </p>
          <p
            style={{
              color: "var(--text-primary)",
              fontSize: 32,
              fontWeight: 800,
              marginTop: 4,
            }}
          >
            {todayCount}
          </p>
        </GlowCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          gap: 16,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            padding: 8,
            boxShadow: "0 0 40px rgba(249,115,22,0.08)",
          }}
        >
          <style>{`
            .rbc-calendar { background: var(--surface); color: var(--text-primary); font-family: var(--font-mono); font-size: 11px; }
            .rbc-header { background: var(--surface-alt); color: var(--text-secondary); border-color: var(--border) !important; padding: 8px 0; letter-spacing: 2px; }
            .rbc-month-view, .rbc-time-view { border-color: var(--border) !important; border-radius: 10px; overflow: hidden; }
            .rbc-day-bg, .rbc-month-row, .rbc-date-cell, .rbc-time-content > * + * > * { border-color: var(--border) !important; }
            .rbc-off-range-bg { background: var(--bg); }
            .rbc-today { background: rgba(249,115,22,0.08) !important; }
            .rbc-event { border: none; border-radius: 6px; font-size: 10px; font-family: var(--font-mono); box-shadow: 0 0 12px rgba(249,115,22,0.25); }
            .rbc-toolbar { gap: 10px; margin: 10px; }
            .rbc-toolbar button { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; padding: 6px 12px; }
            .rbc-toolbar button:hover { background: rgba(249,115,22,0.1); color: var(--accent); }
            .rbc-toolbar button.rbc-active { background: rgba(249,115,22,0.2); color: var(--accent); border-color: var(--accent); }
            .rbc-toolbar-label { color: var(--text-primary); font-size: 22px; letter-spacing: 1px; }
            .rbc-date-cell { color: var(--text-secondary); padding-right: 8px; }
            .rbc-show-more { color: var(--accent); font-size: 10px; }
          `}</style>

          {loading ? (
            <p style={{ padding: 20, color: "var(--text-secondary)" }}>
              Loading calendar...
            </p>
          ) : error ? (
            <p style={{ padding: 20, color: "var(--danger)" }}>{error}</p>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 620 }}
              eventPropGetter={(event) => {
                const color = priorityMeta[event.priority]?.color || "var(--accent)";

                return {
                  style: {
                    background: color,
                    color: "#020617",
                    fontWeight: 700,
                    opacity: event.completed ? 0.55 : 1,
                  },
                };
              }}
            />
          )}
        </motion.div>

        <GlowCard accent="var(--gold)">
          <p
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 3,
              marginBottom: 16,
            }}
          >
            UPCOMING MISSIONS
          </p>

          {upcoming.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              No scheduled missions yet.
            </p>
          ) : (
            upcoming.map((event, index) => (
              <motion.div
                key={`${event.title}-${event.start.toISOString()}`}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: "12px 0",
                  borderBottom:
                    index < upcoming.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <p style={{ color: "var(--text-primary)", fontSize: 13 }}>
                  {event.title}
                </p>
                <p
                  style={{
                    color: priorityMeta[event.priority]?.color,
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {format(event.start, "MMM d")} • {event.priority}
                </p>
              </motion.div>
            ))
          )}
        </GlowCard>
      </div>
    </div>
  );
}
