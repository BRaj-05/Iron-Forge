import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { dateKey } from "@/lib/daily";
import { requireRole } from "@/lib/session";

const MealEntrySchema = z.object({
  name: z.string().trim().min(1),
  food: z.string().trim().min(1),
  done: z.boolean().default(false),
});

const DietLogSchema = z.object({
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(dateKey()),
  meals: z.array(MealEntrySchema).min(1),
  waterCups: z.coerce.number().int().min(0).max(40).default(0),
  completed: z.boolean().default(false),
  notes: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response || !auth.session) return auth.response;

  const parsed = DietLogSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Diet payload is incomplete." }, { status: 400 });
  }

  const diet = await prisma.dailyDietLog.upsert({
    where: { customerId_logDate: { customerId: auth.session.userId, logDate: parsed.data.logDate } },
    update: {
      meals: parsed.data.meals,
      waterCups: parsed.data.waterCups,
      completed: parsed.data.completed,
      notes: parsed.data.notes,
    },
    create: {
      customerId: auth.session.userId,
      logDate: parsed.data.logDate,
      meals: parsed.data.meals,
      waterCups: parsed.data.waterCups,
      completed: parsed.data.completed,
      notes: parsed.data.notes,
    },
  });

  return NextResponse.json({ diet });
}
