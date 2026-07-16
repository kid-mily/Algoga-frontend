import RepurchaseLtvManageClient from "@/features/statisticadmin/repurchase-ltv/components/RepurchaseLtvManageClient";

export const metadata = {
  title: "재구매/LTV | 알고가 통계 관리자",
  description: "통계 관리자가 재구매와 LTV 지표를 확인하는 화면입니다.",
};

export default function StatisticRepurchaseLtvPage() {
  return <RepurchaseLtvManageClient />;
}
