"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LegalPolicyModal, {
  type LegalPolicyType,
} from "@/features/common/components/LegalPolicyModal";

const serviceLinks = [
  { label: "여행 강의", href: "/classroom" },
  { label: "AI 일정 추천", href: "/aischedule" },
  { label: "커뮤니티", href: "/community" },
];

export default function Footer() {
  const [openPolicy, setOpenPolicy] = useState<LegalPolicyType | null>(null);
  const openInquiry = () => {
    window.dispatchEvent(new CustomEvent("algoga-open-inquiry"));
  };

  return (
    <>
      <footer className="bg-[#286E6B] text-gray-200">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[220px_140px_140px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
            <div className="flex flex-col items-start gap-3">
              <Link href="/" aria-label="알고가 홈으로 이동">
                <Image
                  src="/images/algoga-logo.png"
                  alt="알고가"
                  width={105}
                  height={36}
                  className="h-[36px] w-[105px]"
                />
              </Link>
              <p className="text-sm leading-6 text-white/75">
                AI 기반 여행 학습 및
                <br />
                맞춤 여행 플랫폼
              </p>
            </div>

            <nav aria-label="푸터 서비스 메뉴" className="flex flex-col gap-3 text-sm">
              <h2 className="text-base font-bold text-white">서비스</h2>
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit transition hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <nav aria-label="푸터 고객지원 메뉴" className="flex flex-col gap-3 text-sm">
              <h2 className="text-base font-bold text-white">고객지원</h2>
              <Link
                href="/notice"
                className="w-fit transition hover:text-white hover:underline"
              >
                공지사항
              </Link>
              <button
                type="button"
                onClick={openInquiry}
                className="w-fit cursor-pointer text-left transition hover:text-white hover:underline"
              >
                1:1 문의
              </button>
            </nav>

            <div className="flex flex-col gap-3 text-sm">
              <h2 className="text-base font-bold text-white">문의</h2>
              <a>
                algoga.official@gmail.com
              </a>
              <p className="text-white/70">평일 09:00~18:00</p>
            </div>
          </div>

          <hr className="my-8 border-white/25" />

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs">
            <button
              type="button"
              onClick={() => setOpenPolicy("terms")}
              className="cursor-pointer transition hover:text-white hover:underline"
            >
              이용약관
            </button>
            <button
              type="button"
              onClick={() => setOpenPolicy("privacy")}
              className="cursor-pointer font-semibold text-white transition hover:underline"
            >
              개인정보처리방침
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-1 text-xs leading-5 text-white/70">
            <p>(주)알고가 | 대표이사: 김진도 </p>
            <p className="mt-2">© 2026 Algoga. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LegalPolicyModal
        type={openPolicy}
        onClose={() => setOpenPolicy(null)}
      />
    </>
  );
}
