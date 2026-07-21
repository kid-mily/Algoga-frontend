"use client";

import { useEffect } from "react";
import Link from "next/link";

interface CompletionRequiredToastProps {
  onClose: () => void;
}

const AUTO_CLOSE_MS = 5000;

// 스크롤을 내려도 보이도록 화면 하단에 고정으로 띄우는 완강 안내 토스트
export default function CompletionRequiredToast({
  onClose,
}: CompletionRequiredToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-sm items-start gap-3 rounded-2xl border border-[#F3D2D2] bg-white px-4 py-3 shadow-[0_12px_32px_rgba(55,88,110,0.18)]">
        <span className="mt-0.5 text-lg">⚠️</span>

        <div className="flex-1 text-sm">
          <p className="font-bold text-[#B54747]">
            이미 구매한 강의를 완강하셔야 패키지 예약이 가능합니다.
          </p>
          <Link
            href="/mypage/coursedetails"
            className="mt-1 inline-block font-bold text-[#439A97] underline"
          >
            강의 이어듣기
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-[#A0AEC0] hover:text-[#718096]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
