import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  AUTH_ADMIN_COOKIE_NAME,
  AUTH_COOKIE_NAME,
} from "@/lib/auth-cookies";
import {
  getQaAdminSessionCookieOptions,
  isSecureRequest,
  QA_ADMIN_COOKIE_NAME,
} from "@/lib/qa-admin-access";

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/admin-worship-panel", request.url);
  const response = NextResponse.redirect(redirectUrl);
  const cookieOptions = getQaAdminSessionCookieOptions(
    isSecureRequest(request)
  );

  response.cookies.set(AUTH_COOKIE_NAME, "1", cookieOptions);
  response.cookies.set(AUTH_ADMIN_COOKIE_NAME, "1", cookieOptions);
  response.cookies.set(QA_ADMIN_COOKIE_NAME, "1", cookieOptions);

  return response;
}
