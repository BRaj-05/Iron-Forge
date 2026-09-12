import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  name: z.string().trim().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const parsed = RegisterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Name, valid email, and an 8 character password are required." },
      { status: 400 },
    );
  }

  const name = parsed.data.fullName || parsed.data.name;
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
      phone: parsed.data.phone,
      assignedCustomerIds: [],
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ message: "Registration successful. You can log in now.", user }, { status: 201 });
}
