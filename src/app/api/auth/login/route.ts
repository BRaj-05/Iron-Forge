import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const demoUsers = [
  {
    id: "000000000000000000000001",
    email: "admin@gym.com",
    password: "admin123",
    role: "ADMIN",
  },
  {
    id: "000000000000000000000002",
    email: "user@gym.com",
    password: "user123",
    role: "CUSTOMER",
  },
] as const;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    if (!isEmailValid(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const demoUser = demoUsers.find(
      (user) => user.email === normalizedEmail && user.password === password,
    );

    if (demoUser) {
      const accessToken = signAccessToken({
        id: demoUser.id,
        role: demoUser.role,
      });
      const refreshToken = signRefreshToken({
        id: demoUser.id,
        role: demoUser.role,
      });

      const response = NextResponse.json({
        message: "Demo login successful",
        user: {
          id: demoUser.id,
          role: demoUser.role,
        },
      });

      setAuthCookies(response, accessToken, refreshToken);
      return response;
    }

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email not verified." },
        { status: 403 },
      );
    }

    const accessToken = signAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const refreshToken = signRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        role: user.role,
      },
    });

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
