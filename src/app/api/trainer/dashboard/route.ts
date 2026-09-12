import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["TRAINER"]);
  if (auth.response || !auth.session) return auth.response;

  const trainer = await prisma.user.findUnique({ where: { id: auth.session.userId } });
  if (!trainer) return NextResponse.json({ error: "Trainer not found." }, { status: 404 });

  const customers = trainer.assignedCustomerIds.length
    ? await prisma.user.findMany({ where: { id: { in: trainer.assignedCustomerIds }, role: "CUSTOMER" } })
    : [];
  const attendance = await prisma.attendance.findMany({
    where: { trainerId: trainer.id },
    orderBy: { checkIn: "desc" },
    take: 50,
  });

  return NextResponse.json({ trainer, customers, attendance });
}
