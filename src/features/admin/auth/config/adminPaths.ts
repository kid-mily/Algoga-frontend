// 5개 관리자 패널의 경로·접근 가능 역할을 한 곳에서 관리 (AdminAuthGuard/useAdminLoginForm이 공유)
export const ADMIN_PATH_ROLE_RULES = [
  {
    path: "/contentadmin",
    roles: ["CONTENT_MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/csadmin",
    roles: ["CS_MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/moneyadmin",
    roles: ["SETTLEMENT_MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/statisticadmin",
    roles: ["STATISTICS_MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/superadmin",
    roles: ["SUPER_ADMIN"],
  },
] as const;

export const ADMIN_PATH_PREFIXES = ADMIN_PATH_ROLE_RULES.map((rule) => rule.path);
