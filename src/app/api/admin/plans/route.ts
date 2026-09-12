import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

const PlanSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2),
  durationDays: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  features: z.array(z.string().trim()).default([]),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const plans = await prisma.membershipPlan.findMany({ where: { isActive: true }, orderBy: { price: "asc" } });
  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["OWNER"]);
  if (auth.response) return auth.response;

  const parsed = PlanSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan payload." }, { status: 400 });

  const { id, ...data } = parsed.data;
  const plan = id
    ? await prisma.membershipPlan.update({ where: { id }, data })
    : await prisma.membershipPlan.create({ data });

  return NextResponse.json({ plan });
}
