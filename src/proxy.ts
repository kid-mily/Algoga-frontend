// 관리자 페이지는 배포 환경에서 백엔드 쿠키 도메인과 프론트 도메인이 다를 수 있어
// proxy에서 JWT를 해석하지 않고 백엔드 API 권한 검증에 맡깁니다.
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATHS = [
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
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
