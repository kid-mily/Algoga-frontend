import { ADMIN_PATH_PREFIXES } from "@/features/admin/auth/config/adminPaths";

// 로그인 후 돌아갈 next 파라미터가 우리 admin 경로를 가리킬 때만 안전하게 사용
export const getSafeNextPath = () => {
  const rawNext = new URLSearchParams(window.location.search).get("next");
  if (!rawNext) return null;

  try {
    const nextUrl = new URL(rawNext, window.location.origin);
    const isInternal = nextUrl.origin === window.location.origin;
    const isAdminPath = ADMIN_PATH_PREFIXES.some(
      (path) =>
        nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
    );

    if (!isInternal || !isAdminPath) return null;

    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  } catch {
    return null;
  }
};
