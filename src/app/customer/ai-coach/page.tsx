"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { theme } from "@/lib/theme";

const prompts = [
  "What should I train today?",
  "I missed lunch. What should I do?",
  "How do I reduce fat safely?",
  "What if I have diabetes?",
];

function coachReply(question: string) {
  const text = question.toLowerCase();
  if (text.includes("diabetes")) {
    return "Keep meals consistent, prioritize protein and fiber, avoid sugary drinks, and speak with a doctor or dietitian for personal glucose targets. For training, start with walking, light strength work, and controlled effort.";
  }
  if (text.includes("fat")) {
    return "Use a calorie-aware meal plan, strength train 3-4 days weekly, add low-impact cardio, sleep properly, and avoid crash dieting. Progress is easier when the plan is repeatable.";
  }
  if (text.includes("missed") || text.includes("lunch")) {
    return "Do not punish yourself. Take a balanced next meal: protein, vegetables, and a controlled carb portion. Avoid turning one missed meal into late-night overeating.";
  }
  return "Today: one compound lift, one accessory move, 20-30 minutes easy cardio, and a protein-focused dinner. Keep the session clean, not heroic.";
}

export default function CustomerAICoachPage() {
  const [question, setQuestion] = useState(prompts[0]);
  const [reply, setReply] = useState(coachReply(prompts[0]));
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("WORKOUT");

  async function ask(nextQuestion = question) {
    setQuestion(nextQuestion);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion, category }),
      });
      const data = await res.json();
      setReply(data.message || coachReply(nextQuestion));
    } catch {
      setReply(coachReply(nextQuestion));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>AI COACH PREVIEW</p>
        <h1 style={styles.title}>A coach voice for the moments members usually guess.</h1>
        <p style={styles.copy}>
          This is a safe rule-based preview for Phase 5. A real AI API can later
          use profile, goals, attendance, diet, injury flags, and trainer rules.
        </p>
      </section>

      <section style={styles.chat}>
        <div style={styles.promptList}>
          {prompts.map((prompt) => (
            <button key={prompt} onClick={() => ask(prompt)} style={styles.promptButton}>
              {prompt}
            </button>
          ))}
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)} style={styles.select}>
          <option value="WORKOUT">Workout</option>
          <option value="DIET">Diet</option>
          <option value="ATTENDANCE">Attendance</option>
          <option value="RECOVERY">Recovery</option>
        </select>
        <textarea value={question} onChange={(event) => setQuestion(event.target.value)} style={styles.input} />
        <button disabled={loading} onClick={() => ask()} style={styles.askButton}>
          {loading ? "Thinking..." : "Ask Coach"}
        </button>
        <div style={styles.reply}>
          <span>Coach says</span>
          <p>{reply}</p>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: 32 },
  hero: { border: `1px solid ${theme.border}`, borderRadius: 28, padding: 34, marginBottom: 22, background: "radial-gradient(circle at 80% 20%, rgba(34,197,94,0.18), transparent 28%), #111118" },
  eyebrow: { color: theme.green, fontSize: 10, letterSpacing: 4, fontWeight: 950 },
  title: { fontSize: "clamp(42px, 6vw, 82px)", lineHeight: 0.95, maxWidth: 980, margin: "12px 0" },
  copy: { color: theme.textSecondary, lineHeight: 1.75, maxWidth: 820 },
  chat: { border: `1px solid ${theme.border}`, borderRadius: 24, background: theme.surface, padding: 24, display: "grid", gap: 16 },
  promptList: { display: "flex", flexWrap: "wrap", gap: 10 },
  promptButton: { border: `1px solid ${theme.border}`, borderRadius: 999, background: theme.surfaceAlt, color: theme.textPrimary, padding: "10px 14px", cursor: "pointer", fontWeight: 900 },
  select: { border: `1px solid ${theme.border}`, borderRadius: 14, background: theme.surfaceAlt, color: theme.textPrimary, padding: 14, fontWeight: 900 },
  input: { minHeight: 120, border: `1px solid ${theme.border}`, borderRadius: 16, background: "#0A0A0F", color: theme.textPrimary, padding: 16, resize: "vertical" },
  askButton: { border: "none", borderRadius: 14, background: theme.gradientGreen, color: "#fff", padding: "14px 16px", cursor: "pointer", fontWeight: 950, justifySelf: "start" },
  reply: { borderRadius: 18, border: `1px solid ${theme.green}44`, background: `${theme.green}12`, padding: 18, color: theme.textSecondary, lineHeight: 1.7 },
};
