import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dateKey } from "@/lib/daily";
import { requireRole } from "@/lib/session";

export async function POST(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response || !auth.session) return auth.response;

  const customer = await prisma.user.findUnique({
    where: { id: auth.session.userId },
    select: { id: true, assignedTrainerId: true },
  });

  if (!customer) return NextResponse.json({ error: "Customer not found." }, { status: 404 });

  try {
    const attendance = await prisma.attendance.create({
      data: {
        customerId: customer.id,
        trainerId: customer.assignedTrainerId,
        logDate: dateKey(),
      },
    });

    return NextResponse.json({ message: "Check-in successful", attendance }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Already checked in today." }, { status: 409 });
    }

    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Failed to check in." }, { status: 500 });
  }
}
