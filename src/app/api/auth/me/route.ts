import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      photoUrl: true,
      address: true,
      dateOfBirth: true,
      gender: true,
      heightCm: true,
      weightKg: true,
      emergencyContact: true,
      isActive: true,
      specialization: true,
      bio: true,
      experienceYrs: true,
    },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
