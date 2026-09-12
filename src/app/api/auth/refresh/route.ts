import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import { verifyRefreshToken, signAccessToken } from "../../../../lib/auth";

export async function POST() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided." },
        { status: 401 },
      );
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return NextResponse.json(
        { error: "Invalid refresh token." },
        { status: 401 },
      );
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 401 });
    }

    const accessToken = signAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const response = NextResponse.json({ message: "Token refreshed." });
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
