import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";
import { requireRole } from "@/lib/session";

const UpdateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  isActive: z.boolean().optional(),
  assignedTrainerId: z.string().nullable().optional(),
  specialization: z.string().trim().nullable().optional(),
  bio: z.string().trim().nullable().optional(),
  experienceYrs: z.coerce.number().int().min(0).nullable().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, ["OWNER"]);
  if (auth.response) return auth.response;

  const parsed = UpdateUserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid user payload." }, { status: 400 });

  const { id } = await context.params;
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const user = await prisma.user.update({ where: { id }, data: parsed.data });

  if (parsed.data.assignedTrainerId !== undefined && existing.assignedTrainerId) {
    const previousTrainer = await prisma.user.findUnique({ where: { id: existing.assignedTrainerId } });
    if (previousTrainer) {
      await prisma.user.update({
        where: { id: previousTrainer.id },
        data: {
          assignedCustomerIds: previousTrainer.assignedCustomerIds.filter((customerId) => customerId !== id),
        },
      });
    }
  }

  if (parsed.data.assignedTrainerId) {
    const trainer = await prisma.user.findUnique({ where: { id: parsed.data.assignedTrainerId } });
    if (!trainer || trainer.role !== "TRAINER") {
      return NextResponse.json({ error: "Trainer not found." }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: trainer.id },
      data: { assignedCustomerIds: Array.from(new Set([...trainer.assignedCustomerIds, id])) },
    });
  }

  return NextResponse.json({ user });
}
