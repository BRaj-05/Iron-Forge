import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";
import { requireRole } from "@/lib/session";

const TaskInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  deadline: z.string().datetime().optional(),
  important: z.boolean().optional(),
});

const TaskUpdateSchema = TaskInputSchema.partial().extend({
  id: z.string().min(1),
  completed: z.boolean().optional(),
});
const TaskIdSchema = z.object({ id: z.string().min(1) });
const xpByPriority = { LOW: 5, MEDIUM: 10, HIGH: 20, CRITICAL: 40 } as const;

export async function GET(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response) return auth.response;

  const tasks = await prisma.customerTask.findMany({
    where: { customerId: auth.session.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response) return auth.response;

  const parsed = TaskInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid task title is required." }, { status: 400 });
  }

  const task = await prisma.customerTask.create({
    data: {
      customerId: auth.session.userId,
      ...parsed.data,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
    },
  });
  return NextResponse.json(task, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response) return auth.response;

  const parsed = TaskUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid task update." }, { status: 400 });
  }

  const current = await prisma.customerTask.findFirst({
    where: { id: parsed.data.id, customerId: auth.session.userId },
  });
  if (!current) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  const newlyCompleted = parsed.data.completed === true && !current.completed;
  const xpEarned = newlyCompleted
    ? xpByPriority[parsed.data.priority || current.priority]
    : current.xpEarned;
  const task = await prisma.customerTask.update({
    where: { id: current.id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
      important: parsed.data.important,
      completed: parsed.data.completed,
      status:
        parsed.data.completed === true
          ? "COMPLETED"
          : parsed.data.completed === false
            ? "PENDING"
            : undefined,
      xpEarned,
    },
  });

  if (newlyCompleted) {
    const currentProgress = await prisma.customerProgress.findUnique({
      where: { customerId: auth.session.userId },
    });
    const nextXp = (currentProgress?.xp || 0) + xpEarned;
    await prisma.customerProgress.upsert({
      where: { customerId: auth.session.userId },
      create: {
        customerId: auth.session.userId,
        xp: nextXp,
        level: Math.floor(nextXp / 100) + 1,
        streak: 1,
        lastCompletedDate: new Date(),
      },
      update: {
        xp: nextXp,
        level: Math.floor(nextXp / 100) + 1,
        streak: { increment: 1 },
        lastCompletedDate: new Date(),
      },
    });
  }

  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response) return auth.response;

  const parsed = TaskIdSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Task id is required." }, { status: 400 });
  }

  const result = await prisma.customerTask.deleteMany({
    where: { id: parsed.data.id, customerId: auth.session.userId },
  });
  if (!result.count) return NextResponse.json({ error: "Task not found." }, { status: 404 });
  return NextResponse.json({ message: "Task deleted." });
}
