import type { Metadata } from "next";
import { cookies } from "next/headers";
import MoneyRefundManageClient from "@/features/moneyadmin/refund/components/MoneyRefundManageClient";
import type { MoneyRefund } from "@/features/moneyadmin/refund/types";
import { getAdminRefunds } from "@/features/services/adminRefund.service";

export const metadata: Metadata = {
  title: "환불 승인 관리 | 알고가 정산 관리자",
  description: "정산 관리자가 환불 요청을 조회하고 승인, 반려, 완료 처리하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MoneyAdminRefundsPage() {
  const cookieStore = await cookies();
  let initialRefunds: MoneyRefund[] = [];
  let hasInitialData = false;

  try {
    initialRefunds = await getAdminRefunds({
      headers: { Cookie: cookieStore.toString() },
    });
    hasInitialData = true;
  } catch {
    initialRefunds = [];
  }

  return (
    <MoneyRefundManageClient
      initialRefunds={initialRefunds}
      hasInitialData={hasInitialData}
    />
  );
}
