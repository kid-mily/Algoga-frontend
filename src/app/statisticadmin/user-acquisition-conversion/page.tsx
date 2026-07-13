import type { Metadata } from "next";
import UserSignupPathStatisticsManageClient from "@/features/statisticadmin/user/components/UserSignupPathStatisticsManageClient";

export const metadata: Metadata = {
  title: "유입경로별 전환 | 알고가 통계 관리자",
  description: "통계 관리자가 유입경로별 전환 지표를 확인하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatisticUserAcquisitionConversionPage() {
  return <UserSignupPathStatisticsManageClient />;
}
