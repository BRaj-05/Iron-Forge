import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
  "/api/cron",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`),
  );
}

function homeFor(role: string) {
  if (role === "OWNER") return "/admin";
  if (role === "TRAINER") return "/trainer";
  return "/customer/dashboard";
}

function normalizeRole(role?: string) {
  if (role === "ADMIN") return "OWNER";
  if (role === "CUSTOMER" || role === "TRAINER" || role === "OWNER") return role;
  return undefined;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request as unknown as Request);
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = verifyAccessToken(token);
    const role = normalizeRole(decoded.role);
    if (!role) return NextResponse.redirect(new URL("/login", request.url));

    if (pathname.startsWith("/admin") && role !== "OWNER") {
      return NextResponse.redirect(new URL(homeFor(role), request.url));
    }

    if (pathname.startsWith("/trainer") && role !== "TRAINER") {
      return NextResponse.redirect(new URL(homeFor(role), request.url));
    }

    if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL(homeFor(role), request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/trainer/:path*",
    "/customer/:path*",
    "/api/admin/:path*",
    "/api/protected/:path*",
  ],
};
