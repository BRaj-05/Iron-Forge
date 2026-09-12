import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { updateSubscriptionExpiryForUser } from "@/lib/subscriptions";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function dashboardFor(role: string) {
  if (role === "OWNER") return "/admin";
  if (role === "TRAINER") return "/trainer";
  return "/customer/dashboard";
}

export async function POST(request: Request) {
  const parsed = LoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email and password are required." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (!user.isActive) {
    return NextResponse.json({ error: "This account is inactive. Contact the gym owner." }, { status: 403 });
  }

  if (user.role === "CUSTOMER") {
    await updateSubscriptionExpiryForUser(user.id);
  }

  const token = createSessionToken({ userId: user.id, role: user.role });
  const response = NextResponse.json({
    message: "Login successful",
    redirectTo: dashboardFor(user.role),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
    },
  });

  setSessionCookie(response, token);
  return response;
}
