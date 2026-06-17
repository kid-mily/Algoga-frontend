import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentManageClient from "@/features/moneyadmin/payment/components/PaymentManageClient";

export const metadata: Metadata = {
  title: "결제 내역 조회 | 알고가 정산 관리자",
  description: "정산 관리자가 결제 내역을 조회, 검색, 필터링하고 엑셀로 내려받는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MoneyAdminPaymentsPage() {
  return (
    <Suspense
      fallback={
        <section
          role="status"
          aria-live="polite"
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]"
        >
          결제 내역을 불러오는 중입니다...
        </section>
      }
    >
      <PaymentManageClient />
    </Suspense>
  );
}
