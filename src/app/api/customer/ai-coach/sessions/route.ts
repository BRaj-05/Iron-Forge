import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma/client";
import { getSessionFromRequest, requireRole } from "@/lib/session";
import { sessionSchema } from "@/modules/ai-coach/validation";
import { formScore } from "@/modules/ai-coach/engine";

async function authorize(request: Request) {
  if (!(await getSessionFromRequest(request)))
    return {
      response: NextResponse.json(
        { error: "Sign in to access workouts." },
        { status: 401 },
      ),
      session: null,
    };
  return requireRole(request, ["CUSTOMER"]);
}

export async function POST(request: Request) {
  try {
    const auth = await authorize(request);
    if (auth.response) return auth.response;
    const text = await request.text();
    if (text.length > 12000)
      return NextResponse.json(
        { error: "Workout payload too large." },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }
    const parsed = sessionSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid workout metrics.", details: parsed.error.flatten() },
        { status: 400 },
      );
    const data = parsed.data;
    const result = await prisma.aIWorkoutSession.upsert({
      where: {
        customerId_clientSessionId: {
          customerId: auth.session!.userId,
          clientSessionId: data.clientSessionId,
        },
      },
      update: {},
      create: {
        ...data,
        customerId: auth.session!.userId,
        startedAt: new Date(data.startedAt),
        endedAt: new Date(data.endedAt),
        completedSets: Math.floor(data.completedReps / data.targetReps),
        formScore: formScore(data.completedReps, data.goodReps),
        formIssueCount: data.issues.reduce((sum, item) => sum + item.count, 0),
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("AI workout save failed", error);
    return NextResponse.json(
      { error: "Could not save workout. Please retry." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const auth = await authorize(request);
    if (auth.response) return auth.response;
    const where = { customerId: auth.session!.userId };
    const [sessions, totals, counts] = await Promise.all([
      prisma.aIWorkoutSession.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.aIWorkoutSession.aggregate({
        where,
        _count: true,
        _sum: { completedReps: true },
        _avg: { formScore: true },
      }),
      prisma.aIWorkoutSession.groupBy({
        by: ["exercise"],
        where,
        _count: { exercise: true },
        orderBy: { _count: { exercise: "desc" } },
        take: 1,
      }),
    ]);
    return NextResponse.json({
      sessions,
      totalWorkouts: totals._count,
      totalReps: totals._sum.completedReps ?? 0,
      averageScore: Math.round(totals._avg.formScore ?? 0),
      mostPracticed: counts[0]?.exercise ?? null,
    });
  } catch (error) {
    console.error("AI workout history failed", error);
    return NextResponse.json(
      { error: "Could not load workout history. Please retry." },
      { status: 500 },
    );
  }
}
