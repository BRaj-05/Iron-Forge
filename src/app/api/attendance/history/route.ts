import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["CUSTOMER"]);
  if (auth.response || !auth.session) return auth.response;

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const attendance = await prisma.attendance.findMany({
    where: {
      customerId: auth.session.userId,
      checkIn: { gte: last30Days },
    },
    orderBy: { checkIn: "desc" },
  });

  return NextResponse.json(
    attendance.map((item) => ({
      id: item.id,
      checkInTime: item.checkIn,
      checkOutTime: item.checkOut,
      logDate: item.logDate,
    })),
  );
}
