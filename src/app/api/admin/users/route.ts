import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

const QuerySchema = z.object({
  role: z.enum(["CUSTOMER", "TRAINER", "OWNER"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  search: z.string().trim().optional(),
});

const CreateUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["TRAINER", "CUSTOMER"]),
  phone: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  experienceYrs: z.coerce.number().int().min(0).optional(),
});

export async function GET(request: Request) {
  const auth = await requireRole(request, ["OWNER"]);
  if (auth.response) return auth.response;

  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid filters." }, { status: 400 });

  const users = await prisma.user.findMany({
    where: {
      role: parsed.data.role,
      isActive: parsed.data.status ? parsed.data.status === "active" : undefined,
      OR: parsed.data.search
        ? [
            { name: { contains: parsed.data.search, mode: "insensitive" } },
            { email: { contains: parsed.data.search, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["OWNER"]);
  if (auth.response) return auth.response;

  const parsed = CreateUserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid user payload." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase().trim(),
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
        role: parsed.data.role,
        phone: parsed.data.phone,
        specialization: parsed.data.role === "TRAINER" ? parsed.data.specialization : undefined,
        bio: parsed.data.role === "TRAINER" ? parsed.data.bio : undefined,
        experienceYrs: parsed.data.role === "TRAINER" ? parsed.data.experienceYrs : undefined,
        assignedCustomerIds: [],
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }
}
