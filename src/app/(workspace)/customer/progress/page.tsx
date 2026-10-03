"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Flame, Gauge, Medal, TrendingUp } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { CountUp } from "@/components/motion/CountUp";
import { apiRoutes } from "@/config/api-routes";
import { experienceSlides } from "@/lib/experience-media";
import FormProgress from "@/modules/ai-coach/FormProgress";

type ProgressData = {
  weeklyXP: number;
  totalXP: number;
  avgScore: number;
  weightTrend: number;
  level: number;
  streak: number;
  weekly: Array<{ day: string; logDate: string; xp: number; score: number }>;
  body: Array<{ week: string; weight: number; height: number }>;
};

const empty: ProgressData = {
  weeklyXP: 0, totalXP: 0, avgScore: 0, weightTrend: 0,
  level: 1, streak: 0, weekly: [], body: [],
};

export default function CustomerProgressPage() {
  const [data, setData] = useState<ProgressData>(empty);

  useEffect(() => {
    fetch(apiRoutes.customer.progress, { cache: "no-store" })
      .then((res) => res.json())
      .then((payload) => setData({ ...empty, ...payload }))
      .catch(() => setData(empty));
  }, []);

  const hasProgress =
    (data.totalXP || data.weeklyXP) > 0 ||
    data.body.some((item) => item.weight || item.height);

  const weeklyGoal = 1000;
  const weeklyPercent = Math.min(100, Math.round((data.weeklyXP / weeklyGoal) * 100));
  const activeDays = useMemo(
    () => data.weekly.filter((day) => day.xp > 0).length,
    [data.weekly],
  );

  return (
    <div className="progress-lab-page">
      <section
        className="progress-lab-hero"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7,8,11,.96), rgba(7,8,11,.72) 58%, rgba(7,8,11,.38)), url(" +
            experienceSlides[0].image +
            ")",
        }}
      >
        <div className="progress-lab-copy">
          <p className="if-kicker">Performance intelligence</p>
          <h1>See the work becoming progress.</h1>
          <p>
            Training, consistency, body trends and AI form sessions come together
            in one place so the next decision is obvious.
          </p>
          <div className="progress-lab-actions">
            <Link href="/customer/daily-log">Log today <ArrowUpRight size={16} /></Link>
            <Link href="/customer/ai-coach" className="is-secondary">Check form</Link>
          </div>
        </div>

        <div className="progress-score-card">
          <span>Current level</span>
          <strong>{data.level}</strong>
          <small>{data.streak ? data.streak + "-day streak in motion" : "Build your first streak"}</small>
          <div
            className="progress-score-ring"
            style={{ ["--progress" as string]: weeklyPercent + "%" }}
          >
            <b>{weeklyPercent}%</b>
            <em>weekly goal</em>
          </div>
        </div>
      </section>

      <section className="progress-metric-grid" aria-label="Progress summary">
        <Metric icon={<Medal size={18} />} label="Total XP" value={<CountUp value={data.totalXP || data.weeklyXP} />} detail={data.weeklyXP + " this week"} tone="gold" />
        <Metric icon={<Gauge size={18} />} label="Avg score" value={<><CountUp value={data.avgScore} />%</>} detail="Daily performance" tone="green" />
        <Metric icon={<TrendingUp size={18} />} label="Weight trend" value={<><CountUp value={data.weightTrend} />kg</>} detail="From saved measurements" tone="orange" />
        <Metric icon={<Flame size={18} />} label="Consistency" value={<><CountUp value={activeDays} />/7</>} detail={data.streak + " day streak"} tone="blue" />
      </section>

      {hasProgress ? (
        <section className="progress-chart-layout">
          <article className="progress-chart-card is-wide">
            <div className="progress-card-head">
              <div>
                <p className="if-kicker">XP rhythm</p>
                <h2>Training momentum</h2>
              </div>
              <span className="progress-mini-badge"><Activity size={14} /> {data.weeklyXP} XP</span>
            </div>
            <p className="progress-card-copy">See exactly which days are carrying your week.</p>
            <div className="progress-chart">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.weekly}>
                  <defs>
                    <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                  <XAxis dataKey="day" stroke="#7f8490" axisLine={false} tickLine={false} />
                  <YAxis stroke="#7f8490" axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ stroke: "rgba(249,115,22,.25)" }}
                    contentStyle={{ background: "#14161c", color: "#fff", border: "1px solid #252934", borderRadius: 12 }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#f97316" strokeWidth={3} fill="url(#xpFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="progress-chart-card">
            <div className="progress-card-head">
              <div>
                <p className="if-kicker">Body trend</p>
                <h2>Saved metrics</h2>
              </div>
            </div>
            <p className="progress-card-copy">Your recorded weight and height history.</p>
            <div className="progress-chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.body}>
                  <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                  <XAxis dataKey="week" stroke="#7f8490" axisLine={false} tickLine={false} />
                  <YAxis stroke="#7f8490" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#14161c", color: "#fff", border: "1px solid #252934", borderRadius: 12 }} />
                  <Bar dataKey="weight" fill="#f97316" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="height" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      ) : (
        <section className="progress-empty-state">
          <span><Activity size={24} /></span>
          <div>
            <p className="if-kicker">Your timeline starts here</p>
            <h2>One saved workout is enough to begin.</h2>
            <p>Log training, meals or body metrics and Iron Forge will turn them into useful trends.</p>
          </div>
          <Link href="/customer/workouts">Start training <ArrowUpRight size={16} /></Link>
        </section>
      )}

      <FormProgress />
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  detail: string;
  tone: string;
}) {
  return (
    <article className={"progress-metric-card tone-" + tone}>
      <span className="progress-metric-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <p>{detail}</p>
      </div>
    </article>
  );
}
