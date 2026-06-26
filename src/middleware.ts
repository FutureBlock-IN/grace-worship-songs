import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { isAdminRoute } from "@/lib/admin-access";
import {
  AUTH_ADMIN_COOKIE_NAME as ADMIN_COOKIE,
  AUTH_COOKIE_NAME as AUTH_COOKIE,
} from "@/lib/auth-cookies";
import {
  getQaAdminSessionCookieOptions,
  isQaAdminEntryPath,
  isSecureRequest,
  QA_ADMIN_COOKIE_NAME,
} from "@/lib/qa-admin-access";

const PUBLIC_PATHS = ["/", "/about", "/privacy", "/signin", "/signup", "/forgot-password"];

const AUTH_ONLY_PATHS = ["/signin", "/signup", "/forgot-password"];

const PROTECTED_PATHS = ["/groups", "/profile", "/events", "/dashboard"];

function isPathMatch(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = req.cookies.has(AUTH_COOKIE);
  const isAdmin = req.cookies.has(ADMIN_COOKIE);
  const hasQaAdminAccess = req.cookies.has(QA_ADMIN_COOKIE_NAME);

  if (isQaAdminEntryPath(pathname)) {
    const response = NextResponse.redirect(
      new URL("/admin-worship-panel", req.url)
    );
    const cookieOptions = getQaAdminSessionCookieOptions(
      isSecureRequest(req)
    );

    response.cookies.set(AUTH_COOKIE, "1", cookieOptions);
    response.cookies.set(ADMIN_COOKIE, "1", cookieOptions);
    response.cookies.set(QA_ADMIN_COOKIE_NAME, "1", cookieOptions);

    return response;
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ONLY_PATHS.some((path) => pathname === path)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Admin-only routes (QA secret URL or email-based super-admin cookie)
  if (isAdminRoute(pathname)) {
    if (hasQaAdminAccess) {
      return NextResponse.next();
    }
    if (!isAuthenticated) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes — redirect to /signin if not authenticated
  if (isPathMatch(pathname, PROTECTED_PATHS)) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // Allow public routes and everything else
  if (isPathMatch(pathname, PUBLIC_PATHS) || !isPathMatch(pathname, PROTECTED_PATHS)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt).*)"],
};
