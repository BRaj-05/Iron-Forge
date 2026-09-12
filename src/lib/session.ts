import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getTokenFromRequest, signAccessToken, verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const RoleSchema = z.enum(["CUSTOMER", "TRAINER", "OWNER"]);
export type AppRole = z.infer<typeof RoleSchema>;

export type SessionUser = {
  userId: string;
  role: AppRole;
};

export function normalizeRole(role?: string) {
  if (role === "ADMIN") return "OWNER";
  if (role === "CUSTOMER" || role === "TRAINER" || role === "OWNER") return role;
  return undefined;
}

export function createSessionToken(user: SessionUser) {
  return signAccessToken({ userId: user.userId, id: user.userId, role: user.role });
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    const decoded = verifyAccessToken(token);
    const userId = decoded.userId || decoded.id;
    const role = normalizeRole(decoded.role);
    if (!userId || !role) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: Request): Promise<SessionUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  try {
    const decoded = verifyAccessToken(token);
    const userId = decoded.userId || decoded.id;
    const role = normalizeRole(decoded.role);
    if (!userId || !role) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

export async function requireRole(request: Request, roles: AppRole[]) {
  const session = await getSessionFromRequest(request);
  if (!session || !roles.includes(session.role)) {
    return { session: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, isActive: true },
  });

  if (!user || !user.isActive || !roles.includes(user.role)) {
    return { session: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session: { userId: user.id, role: user.role }, response: null };
}
