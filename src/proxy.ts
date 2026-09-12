import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/api/auth"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request as unknown as Request);

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = verifyAccessToken(token);

    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/api/admin-only")
    ) {
      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    if (pathname.startsWith("/customer")) {
      if (decoded.role !== "CUSTOMER" && decoded.role !== "TRAINER") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
    "/api/admin/:path*",
    "/api/admin-only/:path*",
    "/api/protected/:path*",
  ],
};
