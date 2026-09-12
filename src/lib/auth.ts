import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
  id: string;
  userId?: string;
  role?: "ADMIN" | "CUSTOMER" | "TRAINER" | "STAFF" | "MANAGER" | "OWNER";
  email?: string;
  iat?: number;
  exp?: number;
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  (!IS_PRODUCTION ? ACCESS_TOKEN_SECRET : undefined);

function requireEnv(name: string, value?: string) {
  if (!value) {
    throw new Error(`${name} is required in environment variables`);
  }
  return value;
}

export function signAccessToken(payload: object) {
  return jwt.sign(payload, requireEnv("JWT_SECRET", ACCESS_TOKEN_SECRET), {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(
    payload,
    requireEnv("JWT_REFRESH_SECRET", REFRESH_TOKEN_SECRET),
    {
      expiresIn: "7d",
    },
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(
    token,
    requireEnv("JWT_SECRET", ACCESS_TOKEN_SECRET),
  ) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    requireEnv("JWT_REFRESH_SECRET", REFRESH_TOKEN_SECRET),
  ) as AuthTokenPayload;
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    maxAge: 15 * 60,
    path: "/",
  });

  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/api/auth/refresh",
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    expires: new Date(0),
    path: "/api/auth/refresh",
  });
}

export function getTokenFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((item) => {
      const [key, ...value] = item.split("=");
      return [key?.trim(), decodeURIComponent(value.join("=") || "")];
    }),
  );

  return cookies["access_token"] || cookies["token"] || null;
}
