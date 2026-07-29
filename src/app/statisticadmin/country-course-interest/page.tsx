import type { Metadata } from "next";
import CountryCourseInterestManageClient from "@/features/statisticadmin/country-course-interest/components/CountryCourseInterestManageClient";

export const metadata: Metadata = {
  title: "나라·강의별 관심도 | 알고가 통계 관리자",
  description: "통계 관리자가 나라와 강의별 관심 지표를 확인하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatisticCountryCourseInterestPage() {
  return <CountryCourseInterestManageClient />;
}
