"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MyPageInfoCard from "@/features/mypage/MyPageInfoCard";
import MyPageSummaryCard from "@/features/mypage/MyPageSummaryCard";
import EmailAuthVerifyModal from "@/features/mypage/EmailAuthVerifyModal";
import { useMyPageData } from "@/features/mypage/MyPageDataProvider";

export default function MyPage() {
  const router = useRouter();
  const [isEmailAuthModalOpen, setIsEmailAuthModalOpen] = useState(false);

  const { user, summary } = useMyPageData();

  if (!user) return null;

  const userInitial = user.name[0] ?? user.nickname[0] ?? "?";

  const handleEditSuccess = () => {
    setIsEmailAuthModalOpen(false);
    router.push("/mypage/edit");
  };

  return (
    <>
      <header className="mb-5">
        <h1 className="text-xl font-bold text-[#0A1628]">내 정보</h1>
      </header>

      <div className="w-full max-w-3xl">
        <MyPageInfoCard
          user={user}
          initial={userInitial}
          onEdit={() => setIsEmailAuthModalOpen(true)}
        />

        <section
          aria-label="마이페이지 요약"
          className="mt-5 grid grid-cols-3 gap-4"
        >
          <MyPageSummaryCard
            count={summary.courseCount}
            label="수강 강좌"
            href="/mypage/coursedetails"
          />

          <MyPageSummaryCard
            count={summary.reservationCount}
            label="예약 내역"
            href="/mypage/reservations"
          />

          <MyPageSummaryCard
            count={summary.couponCount}
            label="쿠폰/마일리지"
            href="/mypage/benefits"
          />
        </section>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm font-medium text-[#A0AEC0] transition hover:text-red-500"
          >
            회원 탈퇴하기
          </button>
        </div>
      </div>

      <EmailAuthVerifyModal
        open={isEmailAuthModalOpen}
        email={user.email}
        onClose={() => setIsEmailAuthModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}