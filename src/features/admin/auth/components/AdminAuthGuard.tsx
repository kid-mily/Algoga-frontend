"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { clearAdminSessionActive, getAdminSessionRole, isAdminSessionActive } from "@/features/admin/auth/services/adminSession";

const PATH_ROLE_RULES = [
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

const isPathMatch = (pathname: string, path: string) => {
  return pathname === path || pathname.startsWith(`${path}/`);
};

const canAccessPath = (pathname: string, role: string | null) => {
  if (!role) return false;

  const normalizedRole = role.toUpperCase();
  const matchedRule = PATH_ROLE_RULES.find((rule) =>
    isPathMatch(pathname, rule.path)
  );

  if (!matchedRule) return false;

  return matchedRule.roles.includes(normalizedRole as never);
};

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!isAdminSessionActive()) {
      window.location.replace("/forbidden");
      return;
    }

    const role = getAdminSessionRole();

    if (!role) {
      clearAdminSessionActive();
      window.location.replace("/forbidden");
      return;
    }

    if (!canAccessPath(window.location.pathname, role)) {
      window.location.replace("/forbidden");
      return;
    }

    const timerId = window.setTimeout(() => setIsAllowed(true), 0);

    return () => window.clearTimeout(timerId);
  }, []);

  if (!isAllowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
        <p className="text-[15px] font-semibold text-[#439A97]">
          관리자 로그인 확인 중입니다...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
