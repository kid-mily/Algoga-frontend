"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MyPageUser } from "@/features/mypage/types";
import { getMyCoupons } from "@/features/services/myBenefit.service";
import { getMyPayments } from "@/features/services/SinglePayment.service";
import { getMyPageUser, MyPageApiError } from "@/features/services/mypage.service";
import MyPageSidebar from "@/features/mypage/MyPageSidebar";
import MyPageInfoCard from "@/features/mypage/MyPageInfoCard";
import MyPageSummaryCard from "@/features/mypage/MyPageSummaryCard";

export default function MyPage() {
  const router = useRouter();

  const [user, setUser] = useState<MyPageUser | null>(null);
  const [couponCount, setCouponCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 프로필 이미지가 없을 때 표시할 첫 글자
  const userInitial = useMemo(() => {
    return (
      user?.name?.slice(0, 1) ||
      user?.nickname?.slice(0, 1) ||
      "알"
    );
  }, [user]);

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        /*
         * 사용자 정보는 필수 데이터이므로 실패하면 catch로 이동한다.
         * 쿠폰과 결제 내역은 부가 데이터이므로 실패하면 빈 배열로 처리한다.
         */
        const [me, coupons, payments] = await Promise.all([
          getMyPageUser(),
          getMyCoupons().catch(() => []),
          getMyPayments().catch(() => []),
        ]);

        setUser(me);

        setCouponCount(
          Array.isArray(coupons) ? coupons.length : 0
        );

        setReservationCount(
          Array.isArray(payments) ? payments.length : 0
        );

        // 수강 내역 API 연결 후 실제 값으로 교체
        setCourseCount(0);
      } catch (error) {
        console.error("마이페이지 조회 실패:", error);

        if (error instanceof MyPageApiError) {
          console.error("마이페이지 API 오류 상세:", {
            status: error.status,
            code: error.code,
            traceId: error.traceId,
            responseData: error.responseData,
          });

          // 인증 쿠키가 없거나 만료된 경우
          if (error.status === 401 || error.status === 403) {
            router.replace("/auth/login");
            return;
          }

          setErrorMessage(error.message);
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "마이페이지 정보를 불러오지 못했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPageData();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA]">
        <p className="text-sm font-medium text-[#8A9BB0]">
          마이페이지 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (errorMessage || !user) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#0A1628]">
            정보를 불러올 수 없습니다
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {errorMessage ||
              "사용자 정보를 찾을 수 없습니다."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA]">
      <div className="flex w-full">
        <MyPageSidebar
          name={user.name}
          initial={userInitial}
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
              onEdit={() =>
                router.push("/mypage/edit")
              }
            />

            <section
              aria-label="마이페이지 요약"
              className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <MyPageSummaryCard
                count={courseCount}
                label="수강 강좌"
              />

              <MyPageSummaryCard
                count={reservationCount}
                label="예약 내역"
              />

              <MyPageSummaryCard
                count={couponCount}
                label="보유 쿠폰"
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
  );
}