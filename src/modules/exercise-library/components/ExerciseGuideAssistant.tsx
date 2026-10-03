"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, MessageCircleQuestion, Sparkles } from "lucide-react";
import type { Exercise } from "@/lib/exercise-data";

const prompts = [
  "How do I start?",
  "What should I feel?",
  "Beginner version?",
  "What mistakes should I avoid?",
] as const;

export default function ExerciseGuideAssistant({ exercise }: { exercise: Exercise }) {
  const [active, setActive] = useState<(typeof prompts)[number]>("How do I start?");

  const answer = useMemo(() => {
    if (active === "How do I start?") {
      return exercise.steps.slice(0, 2).join(" ");
    }
    if (active === "What should I feel?") {
      return "Focus on " + exercise.targetMuscles.slice(0, 2).join(" and ") + ". Keep the movement controlled rather than chasing heavier weight.";
    }
    if (active === "Beginner version?") {
      return "Start with " + exercise.setsReps.beginner + ". If the full version feels unstable, try " + exercise.alternatives.slice(0, 2).join(" or ") + ".";
    }
    return exercise.commonMistakes.slice(0, 3).join(" ");
  }, [active, exercise]);

  return (
    <section className="exercise-ai-panel" aria-label={exercise.name + " exercise assistant"}>
      <div className="exercise-ai-head">
        <span className="exercise-ai-icon"><Bot size={20} /></span>
        <div>
          <p className="if-kicker">Exercise assistant</p>
          <h2>Ask before you lift.</h2>
        </div>
      </div>

      <div className="exercise-ai-prompts">
        {prompts.map((prompt) => (
          <button
            type="button"
            key={prompt}
            className={active === prompt ? "is-active" : ""}
            onClick={() => setActive(prompt)}
          >
            <MessageCircleQuestion size={15} />
            {prompt}
          </button>
        ))}
      </div>

      <div className="exercise-ai-answer">
        <Sparkles size={18} />
        <p>{answer}</p>
      </div>

      <Link href="/customer/ai-coach" className="exercise-ai-link">
        Open full AI Coach
      </Link>
    </section>
  );
}
