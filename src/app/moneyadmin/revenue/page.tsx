import type { Metadata } from "next";
import { Suspense } from "react";
import RevenueManageClient from "@/features/moneyadmin/revenue/components/RevenueManageClient";

export const metadata: Metadata = {
  title: "월별 수익 조회 | 알고가 정산 관리자",
  description: "정산 관리자가 월별 매출, 환불, 순수익 통계를 조회하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MoneyAdminRevenuePage() {
  return (
    <Suspense
      fallback={
        <section
          role="status"
          aria-live="polite"
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]"
        >
          월별 수익 통계를 불러오는 중입니다...
        </section>
      }
    >
      <RevenueManageClient />
    </Suspense>
  );
}
