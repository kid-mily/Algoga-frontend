import type { Metadata } from "next";
import { Suspense } from "react";
import MoneyRefundManageClient from "@/features/moneyadmin/refund/components/MoneyRefundManageClient";

export const metadata: Metadata = {
  title: "환불 승인 관리 | 알고가 정산 관리자",
  description: "정산 관리자가 환불 요청을 조회하고 승인, 반려, 완료 처리하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MoneyAdminRefundsPage() {
  return (
    <Suspense
      fallback={
        <section
          role="status"
          aria-live="polite"
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]"
        >
          환불 요청을 불러오는 중입니다...
        </section>
      }
    >
      <MoneyRefundManageClient />
    </Suspense>
  );
}
