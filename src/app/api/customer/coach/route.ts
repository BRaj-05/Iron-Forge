import { NextResponse } from "next/server";
import connectDB from "@/infrastructure/mongoose/connection";
import AIInsight from "@/infrastructure/mongoose/models/AIInsight";
import { requireRole } from "@/lib/session";

type CoachCategory = "WORKOUT" | "DIET" | "ATTENDANCE" | "RECOVERY";

const categories = new Set<CoachCategory>(["WORKOUT", "DIET", "ATTENDANCE", "RECOVERY"]);

async function askOllama(question: string, category: CoachCategory) {
  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: "You are a concise fitness education assistant. Give practical general guidance. Do not diagnose conditions or replace a qualified trainer, doctor, or dietitian. Recommend professional help for pain, injury, medication, or medical conditions." },
        { role: "user", content: `Category: ${category}\nQuestion: ${question}` },
      ],
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("Ollama is unavailable");
  const payload = await response.json();
  const message = String(payload.message?.content || "").trim();
  if (!message) throw new Error("Ollama returned an empty response");
  return { title: "Local AI coach", message, score: 80, provider: `OLLAMA:${model}` };
}

function safeCoachReply(question: string, category: CoachCategory) {
  const text = question.toLowerCase();

  if (text.includes("diabetes") || text.includes("sugar")) {
    return {
      title: "Diabetes-aware guidance",
      message:
        "Keep meals consistent, choose protein plus fiber at each meal, avoid sugary drinks, and use walking plus controlled strength training. For glucose targets or medication timing, speak with your doctor or dietitian.",
      score: 82,
    };
  }

  if (text.includes("fat") || text.includes("weight")) {
    return {
      title: "Fat-loss training direction",
      message:
        "Use 3-4 strength sessions weekly, add low-impact cardio, keep protein high, and avoid crash dieting. The best plan is the one you can repeat for months.",
      score: 78,
    };
  }

  if (text.includes("pain") || text.includes("injury")) {
    return {
      title: "Safety-first adjustment",
      message:
        "Stop sharp-pain movements, reduce load, use gentle range of motion, and ask a trainer to check form. Ongoing pain should be reviewed by a qualified clinician.",
      score: 88,
    };
  }

  if (category === "DIET") {
    return {
      title: "Meal consistency plan",
      message:
        "Protect breakfast, lunch, and dinner before chasing perfect macros. Build each meal with protein, vegetables or fruit, and a controlled carb portion based on your goal.",
      score: 74,
    };
  }

  if (category === "RECOVERY") {
    return {
      title: "Recovery reset",
      message:
        "Use 10 minutes of mobility, hydrate, sleep on time, and keep tomorrow lighter if soreness changes your form. Recovery is part of training, not a break from it.",
      score: 80,
    };
  }

  return {
    title: "Today&apos;s training focus",
    message:
      "Complete one compound lift, one accessory movement, 20-30 minutes of easy cardio, and a protein-focused dinner. Keep the session clean and repeatable.",
    score: 76,
  };
}

export async function POST(req: Request) {
  try {
    const auth = await requireRole(req, ["CUSTOMER"]);
    if (auth.response || !auth.session) return auth.response;
    const body = await req.json();
    const question = String(body.question || "").trim();
    const requestedCategory = String(body.category || "WORKOUT") as CoachCategory;
    const category = categories.has(requestedCategory) ? requestedCategory : "WORKOUT";

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 },
      );
    }

    let provider = "BUILT_IN_FALLBACK";
    let response = safeCoachReply(question, category);
    try {
      const ollama = await askOllama(question, category);
      provider = ollama.provider;
      response = ollama;
    } catch {
      // The built-in coach keeps the feature usable when Ollama is stopped.
    }

    try {
      await connectDB();
      await AIInsight.create({
          generatedFor: auth.session.userId,
          type: category === "DIET" ? "DIET" : "WORKOUT",
          title: response.title.replace("&apos;", "'"),
          message: response.message,
          score: response.score,
          metadata: {
            source: provider,
            question,
            category,
          },
      });
    } catch {
      // A coaching reply should not fail because optional history persistence failed.
    }

    return NextResponse.json({
      provider,
      ...response,
    });
  } catch (error) {
    console.error("AI coach error:", error);
    return NextResponse.json(
      { error: "Failed to generate coach response." },
      { status: 500 },
    );
  }
}
