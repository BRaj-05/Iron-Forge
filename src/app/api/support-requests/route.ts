import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

const requestSchema = z.object({
  type: z.enum([
    "TRAINER_CHANGE",
    "EQUIPMENT_COMPLAINT",
    "EXERCISE_COMPLAINT",
    "SESSION_REQUEST",
    "GENERAL_SUPPORT",
  ]),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(8).max(1200),
  relatedSlug: z.string().trim().max(100).optional(),
});

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where =
    session.role === "OWNER"
      ? {}
      : session.role === "TRAINER"
        ? { assignedTrainerId: session.userId }
        : { requesterId: session.userId };

  const requests = await prisma.supportRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request." }, { status: 400 });
  }

  const requester = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, assignedTrainerId: true },
  });

  if (!requester) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const saved = await prisma.supportRequest.create({
    data: {
      requesterId: requester.id,
      assignedTrainerId: requester.assignedTrainerId,
      type: parsed.data.type,
      subject: parsed.data.subject,
      message: parsed.data.message,
      relatedSlug: parsed.data.relatedSlug,
    },
  });

  const owners = await prisma.user.findMany({
    where: { role: "OWNER", isActive: true },
    select: { id: true },
  });

  if (owners.length) {
    await prisma.notification.createMany({
      data: owners.map((owner) => ({
        userId: owner.id,
        type: parsed.data.type,
        message: `${requester.name}: ${parsed.data.subject}`,
      })),
    });
  }

  return NextResponse.json(saved, { status: 201 });
}
