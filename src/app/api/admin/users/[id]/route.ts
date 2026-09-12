import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
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
  const user = await prisma.user.update({ where: { id }, data: parsed.data });

  if (parsed.data.assignedTrainerId) {
    await prisma.user.update({
      where: { id: parsed.data.assignedTrainerId },
      data: { assignedCustomerIds: { push: id } },
    });
  }

  return NextResponse.json({ user });
}
