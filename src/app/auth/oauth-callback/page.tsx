"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    window.dispatchEvent(new Event("auth-state-changed"));
    router.replace("/");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F8F8] px-6">
      <p className="text-[15px] font-semibold text-[#439A97]">
        로그인 처리 중입니다...
      </p>
    </main>
  );
}
