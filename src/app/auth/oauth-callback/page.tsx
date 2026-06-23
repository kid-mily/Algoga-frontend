// 소셜로그인 끝나고 다시 돌아오는 페이지

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    window.dispatchEvent(new Event("auth-state-changed")); //로그인 상태가 바뀌었다고 앱 전체에 알리려고 필요
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
