import {
  AUTH_ADMIN_COOKIE_NAME,
  AUTH_COOKIE_NAME,
} from "@/lib/auth-cookies";

/** Hard-to-guess entry URL for client / QA admin access (no login). */
export const QA_ADMIN_ENTRY_PATH = "/grace-admin-H3WQ9K7M" as const;

export const QA_ADMIN_COOKIE_NAME = "grace_qa_admin";

/** 30 days */
export const QA_ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function isQaAdminEntryPath(pathname: string): boolean {
  return pathname === QA_ADMIN_ENTRY_PATH;
}

export function hasQaAdminSessionFromCookieHeader(
  cookieHeader: string | undefined
): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.includes(`${QA_ADMIN_COOKIE_NAME}=`);
}

export function hasQaAdminSession(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${QA_ADMIN_COOKIE_NAME}=`));
}

export function getQaAdminSessionCookieOptions(isSecure = false) {
  return {
    path: "/",
    maxAge: QA_ADMIN_SESSION_MAX_AGE,
    sameSite: "lax" as const,
    secure: isSecure,
  };
}

export function isSecureRequest(request: { nextUrl: { protocol: string } }) {
  return request.nextUrl.protocol === "https:";
}

/** Cookies set when visiting the secret entry URL. */
export const QA_ADMIN_GATE_COOKIES = [
  AUTH_COOKIE_NAME,
  AUTH_ADMIN_COOKIE_NAME,
  QA_ADMIN_COOKIE_NAME,
] as const;
