import type { Metadata } from "next";
import UserSignupPathStatisticsManageClient from "@/features/statisticadmin/user/components/UserSignupPathStatisticsManageClient";

export const metadata: Metadata = {
  title: "유저 유입 경로 통계 | 알고가 통계 관리자",
  description: "통계 관리자가 회원가입 유입 경로별 가입 비율과 가입 수를 확인하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatisticAdminUserPage() {
  return <UserSignupPathStatisticsManageClient />;
}
