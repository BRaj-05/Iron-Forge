import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { dateKey } from "@/lib/daily";
import { requireRole } from "@/lib/session";

const AttendanceSchema = z.object({
  customerId: z.string(),
  checkOut: z.boolean().optional(),
});

export async function POST(request: Request) {
  const auth = await requireRole(request, ["TRAINER"]);
  if (auth.response || !auth.session) return auth.response;

  const parsed = AttendanceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid attendance payload." }, { status: 400 });

  const trainer = await prisma.user.findUnique({ where: { id: auth.session.userId } });
  if (!trainer?.assignedCustomerIds.includes(parsed.data.customerId)) {
    return NextResponse.json({ error: "Customer is not assigned to this trainer." }, { status: 403 });
  }

  if (parsed.data.checkOut) {
    const open = await prisma.attendance.findFirst({
      where: { customerId: parsed.data.customerId, trainerId: trainer.id, checkOut: null },
      orderBy: { checkIn: "desc" },
    });
    if (!open) return NextResponse.json({ error: "No open attendance record." }, { status: 404 });
    const attendance = await prisma.attendance.update({ where: { id: open.id }, data: { checkOut: new Date() } });
    return NextResponse.json({ attendance });
  }

  try {
    const attendance = await prisma.attendance.create({
      data: {
        customerId: parsed.data.customerId,
        trainerId: trainer.id,
        logDate: dateKey(),
      },
    });

    return NextResponse.json({ attendance }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "This customer is already checked in today." }, { status: 409 });
    }
    throw error;
  }
}
