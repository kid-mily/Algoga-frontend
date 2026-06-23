"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MyPageSidebar from "@/features/mypage/MyPageSidebar";
import MyPageInfoCard from "@/features/mypage/MyPageInfoCard";
import MyPageSummaryCard from "@/features/mypage/MyPageSummaryCard";
import PasswordVerifyModal from "@/features/mypage/PasswordVerifyModal";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import { useMyPage } from "@/features/mypage/hooks/userMyPage";

export default function MyPage() {
  const router = useRouter();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { user, summary, isLoading, errorMessage } = useMyPage();

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  if (errorMessage || !user) {
    return (
      <MyPageError
        message={errorMessage}
      />
    );
  }

  const userInitial = user.name[0] ?? "?";

  const handleEditSuccess = () => {
    setIsPasswordModalOpen(false);
    router.push("/mypage/edit");
  };

  return (
    <>
      <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA]">
        <div className="flex w-full">
          <MyPageSidebar
            nickname={user.nickname}
            initial={userInitial}
            profileImageUrl={user.profileImageUrl}
          />

          <section className="flex-1 px-10 py-8">
            <div className="mx-auto w-full max-w-2xl">
              <header className="mb-5">
                <h1 className="text-xl font-bold text-[#0A1628]">
                  내 정보
                </h1>
              </header>

              <MyPageInfoCard
                user={user}
                initial={userInitial}
                onEdit={() => setIsPasswordModalOpen(true)}
              />

              <section
                aria-label="마이페이지 요약"
                className="mt-5 grid grid-cols-3 gap-4"
              >
                <MyPageSummaryCard
                  count={summary.courseCount}
                  label="수강 강좌"
                  href = "/mypage/coursedetails"
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
          </section>
        </div>
      </main>

      <PasswordVerifyModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}

interface MyPageErrorProps {
  message: string;
}

function MyPageError({ message }: MyPageErrorProps) {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
      <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-[#0A1628]">
          정보를 불러올 수 없습니다 
        </h1>

        <p className="mt-2 text-sm text-red-500">
          {message}
        </p>
      </section>
    </main>
  );
}
