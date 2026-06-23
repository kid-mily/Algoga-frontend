"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { isAdminSessionActive } from "@/features/admin/auth/adminSession";

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!isAdminSessionActive()) {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.replace(
        `/auth/adminlogin?next=${encodeURIComponent(next)}`
      );
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
