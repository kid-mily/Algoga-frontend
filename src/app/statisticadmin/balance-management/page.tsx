import BalanceManagementClient from "@/features/statisticadmin/balance/components/BalanceManagementClient";

export const metadata = {
  title: "잔금 관리 | 알고가 통계 관리자",
  description: "통계 관리자가 잔금 관리 현황을 확인하는 화면입니다.",
};

export default function StatisticBalanceManagementPage() {
  return <BalanceManagementClient />;
}
