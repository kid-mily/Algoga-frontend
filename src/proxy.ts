//관리자 경로인지 확인하는 코드
import { NextRequest, NextResponse } from "next/server";

const FORBIDDEN_PATH = "/forbidden";
const ADMIN_PATHS = [
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

const ADMIN_ROLES = new Set([
  "CONTENT_MANAGER",
  "CS_MANAGER",
  "SETTLEMENT_MANAGER",
  "STATISTICS_MANAGER",
  "SUPER_ADMIN",
]);

const PATH_ROLE_RULES = [
  {
    path: "/contentadmin",
    roles: ["CONTENT_MANAGER"],
  },
  {
    path: "/csadmin",
    roles: ["CS_MANAGER"],
  },
  {
    path: "/moneyadmin",
    roles: ["SETTLEMENT_MANAGER"],
  },
  {
    path: "/statisticadmin",
    roles: ["STATISTICS_MANAGER"],
  },
  {
    path: "/superadmin",
    roles: ["SUPER_ADMIN"],
  },
] as const;

const SUPER_ADMIN_ROLES = new Set(["SUPER_ADMIN"]);

const AUTH_COOKIE_NAMES = [
  "adminAccessToken",
  "adminRefreshToken",
  "accessToken",
  "refreshToken",
  "Authorization",
];

const isPathMatch = (pathname: string, path: string) => {
  return pathname === path || pathname.startsWith(`${path}/`);
};

const isAdminPath = (pathname: string) => {
  return ADMIN_PATHS.some((path) => isPathMatch(pathname, path));
};

const setNoStoreHeaders = (response: NextResponse) => {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
};

const redirectToForbidden = (request: NextRequest) => {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = FORBIDDEN_PATH;
  redirectUrl.search = "";

  return setNoStoreHeaders(NextResponse.redirect(redirectUrl));
};

const isLocalFrontendHost = (request: NextRequest) => {
  const hostname = request.nextUrl.hostname;

  return hostname === "localhost" || hostname === "127.0.0.1";
};

const decodeJwtPayload = (token?: string) => {
  if (!token) return null;

  try {
    const normalizedToken = token.replace(/^Bearer\s+/i, "");
    const [, payload] = normalizedToken.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const collectRoleValues = (value: unknown): string[] => {
  if (!value) return [];

  if (typeof value === "string") {
    return value.split(/[\s,]+/).filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectRoleValues);
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(
      collectRoleValues
    );
  }

  return [];
};

const getRoleValues = (token?: string) => {
  const payload = decodeJwtPayload(token);
  if (!payload) return [];

  return [
    payload.role,
    payload.roles,
    payload.authority,
    payload.authorities,
    payload.managerRole,
    payload.type,
    payload.scope,
    payload.scopes,
  ].flatMap(collectRoleValues);
};

const normalizeRoles = (roles: string[]) => {
  return roles.map((role) => role.toUpperCase());
};

const hasAdminRole = (roles: string[]) => {
  return roles.some((role) => ADMIN_ROLES.has(role));
};

const canAccessAdminPath = (pathname: string, roles: string[]) => {
  if (roles.some((role) => SUPER_ADMIN_ROLES.has(role))) {
    return true;
  }

  const matchedRule = PATH_ROLE_RULES.find((rule) =>
    isPathMatch(pathname, rule.path)
  );

  if (!matchedRule) return false;

  return matchedRule.roles.some((role) => roles.includes(role));
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (isLocalFrontendHost(request)) {
    return setNoStoreHeaders(NextResponse.next());
  }

  const authCookies = AUTH_COOKIE_NAMES.map(
    (name) => request.cookies.get(name)?.value
  ).filter(Boolean) as string[];

  if (authCookies.length === 0) {
    return redirectToForbidden(request);
  }

  const readableRoles = normalizeRoles(authCookies.flatMap(getRoleValues));

  if (readableRoles.length === 0 || !hasAdminRole(readableRoles)) {
    return redirectToForbidden(request);
  }

  if (!canAccessAdminPath(pathname, readableRoles)) {
    return redirectToForbidden(request);
  }

  return setNoStoreHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/contentadmin/:path*",
    "/csadmin/:path*",
    "/moneyadmin/:path*",
    "/statisticadmin/:path*",
    "/superadmin/:path*",
  ],
};