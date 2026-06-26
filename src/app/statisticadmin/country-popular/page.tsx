import type { Metadata } from "next";
import CountryPopularityManageClient from "@/features/statisticadmin/country-popular/components/CountryPopularityManageClient";

export const metadata: Metadata = {
  title: "나라별 인기도 | 알고가 통계 관리자",
  description: "통계 관리자가 나라별 조회, 예약, 전환 지표와 상위 국가를 확인하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatisticAdminCountryPopularityPage() {
  return <CountryPopularityManageClient />;
}
