import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

import { dashboardFor, normalizeRole } from "@/lib/routing";

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

function unauthenticated(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const url = new URL("/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
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
    return unauthenticated(request);
  }

  try {
    const decoded = verifyAccessToken(token);
    const role = normalizeRole(decoded.role);
    if (!role) return unauthenticated(request);

    if (pathname.startsWith("/api/admin") && role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (pathname.startsWith("/api/customer") && role !== "CUSTOMER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (pathname.startsWith("/api/trainer") && role !== "TRAINER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (pathname.startsWith("/admin") && role !== "OWNER") {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }

    if (pathname.startsWith("/trainer") && role !== "TRAINER") {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }

    if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }

    return NextResponse.next();
  } catch {
    return unauthenticated(request);
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/trainer/:path*",
    "/customer/:path*",
    "/api/admin/:path*",
    "/api/customer/:path*",
    "/api/trainer/:path*",
  ],
};
