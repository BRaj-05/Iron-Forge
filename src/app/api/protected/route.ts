import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: Request) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return NextResponse.json({ error: "No token provided." }, { status: 401 });
  }

  try {
    const decoded = verifyAccessToken(token);
    return NextResponse.json({ message: "Access granted", user: decoded });
  } catch {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }
}
