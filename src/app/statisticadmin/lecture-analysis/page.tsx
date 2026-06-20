import type { Metadata } from "next";
import CourseEnrollmentManageClient from "@/features/statisticadmin/lecture-analysis/components/CourseEnrollmentManageClient";

export const metadata: Metadata = {
  title: "수강률 분석 | 알고가 통계 관리자",
  description: "통계 관리자가 강의별 수강생 수, 평균 진도율, 수료율, 평균 학습 시간을 확인하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatisticAdminLectureAnalysisPage() {
  return <CourseEnrollmentManageClient />;
}
