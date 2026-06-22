import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterPageClient from "@/features/auth/components/RegisterPageClient";

export const metadata: Metadata = {
  title: "회원가입 | 알고가",
  description: "알고가 회원가입 정보를 입력하고 약관 동의를 완료합니다.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main
          className="flex min-h-screen items-center justify-center bg-[#F8F8F8] px-6"
          role="status"
          aria-live="polite"
        >
          <p className="text-[15px] font-semibold text-[#439A97]">
            회원가입 화면을 불러오는 중입니다...
          </p>
        </main>
      }
    >
      <RegisterPageClient />
    </Suspense>
  );
}
