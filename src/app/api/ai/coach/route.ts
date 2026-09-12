import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import AIInsight from "@/models/AIInsight";

type CoachCategory = "WORKOUT" | "DIET" | "ATTENDANCE" | "RECOVERY";

type TokenPayload = {
  id: string;
  role?: string;
  email?: string;
};

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
    const body = await req.json();
    const question = String(body.question || "").trim();
    const category = (body.category || "WORKOUT") as CoachCategory;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 },
      );
    }

    const response = safeCoachReply(question, category);
    const token = getTokenFromRequest(req);

    if (token) {
      try {
        await connectDB();
        const decoded = verifyAccessToken(token) as TokenPayload;
        await AIInsight.create({
          generatedFor: decoded.id,
          type: category === "DIET" ? "DIET" : "WORKOUT",
          title: response.title.replace("&apos;", "'"),
          message: response.message,
          score: response.score,
          metadata: {
            source: "PHASE_6_RULE_BASED_COACH",
            question,
            category,
          },
        });
      } catch {
        // AI response should still work if persistence fails.
      }
    }

    return NextResponse.json({
      provider: "RULE_BASED_PREVIEW",
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
