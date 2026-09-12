import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: Request) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return NextResponse.json({ error: "No token provided." }, { status: 401 });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 },
      );
    }

    return NextResponse.json({ message: "Welcome Admin 👑" });
  } catch {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }
}
