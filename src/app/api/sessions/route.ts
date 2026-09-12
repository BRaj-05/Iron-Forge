import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import TrainerSession from "@/models/TrainerSession";

type TokenPayload = {
  id: string;
  role?: string;
};

const demoSessions = [
  {
    _id: "demo-form-audit",
    title: "Strength Form Audit",
    trainerName: "Coach Arjun",
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 45,
    status: "BOOKED",
    focus: "FORM_CHECK",
  },
  {
    _id: "demo-nutrition",
    title: "Nutrition Review",
    trainerName: "Coach Mira",
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 30,
    status: "REQUESTED",
    focus: "DIET",
  },
];

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token) as TokenPayload;

    await connectDB();
    const sessions = await TrainerSession.find({ userId: decoded.id })
      .sort({ scheduledAt: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(sessions.length ? sessions : demoSessions);
  } catch (error) {
    console.error("Sessions GET error:", error);
    return NextResponse.json(demoSessions);
  }
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token) as TokenPayload;
    const body = await req.json();

    await connectDB();
    const session = await TrainerSession.create({
      userId: decoded.id,
      title: body.title || "Trainer Session",
      focus: body.focus || "FORM_CHECK",
      requestedDate: body.requestedDate ? new Date(body.requestedDate) : new Date(),
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      durationMinutes: Number(body.durationMinutes || 45),
      notes: body.notes || "",
      status: "REQUESTED",
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Sessions POST error:", error);
    return NextResponse.json(
      { error: "Could not request session." },
      { status: 500 },
    );
  }
}
