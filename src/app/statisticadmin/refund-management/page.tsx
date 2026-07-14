import RefundManagementClient from "@/features/statisticadmin/refund/components/RefundManagementClient";

export const metadata = {
  title: "환불 관리 | 알고가 통계 관리자",
  description: "통계 관리자가 환불 관리 현황을 확인하는 화면입니다.",
};

export default function StatisticRefundManagementPage() {
  return <RefundManagementClient />;
}
