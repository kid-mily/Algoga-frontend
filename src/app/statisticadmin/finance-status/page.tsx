import SalesFinanceManageClient from "@/features/statisticadmin/sales/components/SalesFinanceManageClient";

export const metadata = {
  title: "재무현황 | 알고가 통계 관리자",
  description: "통계 관리자가 재무 현황을 확인하는 화면입니다.",
};

export default function StatisticSalesPage() {
  return <SalesFinanceManageClient />;
}
