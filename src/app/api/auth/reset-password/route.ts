import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/infrastructure/prisma/client";

const ResetPasswordSchema = z.object({ token: z.string().min(1), password: z.string().min(8) });

export async function POST(req: Request) {
  try {
    const parsed = ResetPasswordSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid token or password." },
        { status: 400 },
      );
    }

    const resetTokenHash = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
    const user = await prisma.user.findFirst({
      where: { resetTokenHash, resetTokenExpiresAt: { gt: new Date() } },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
    });

    return NextResponse.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
