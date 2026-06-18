import type { Metadata } from "next";
import { Suspense } from "react";
import CouponStatisticsManageClient from "@/features/moneyadmin/coupon/components/CouponStatisticsManageClient";

export const metadata: Metadata = {
  title: "쿠폰 사용 현황 조회 | 알고가 정산 관리자",
  description: "정산 관리자가 쿠폰 발급, 사용, 만료, 할인 금액 통계를 조회하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MoneyAdminCouponsPage() {
  return (
    <Suspense
      fallback={
        <section
          role="status"
          aria-live="polite"
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]"
        >
          쿠폰 통계를 불러오는 중입니다...
        </section>
      }
    >
      <CouponStatisticsManageClient />
    </Suspense>
  );
}
