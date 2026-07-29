import LectureReservationConversionClient from "@/features/statisticadmin/course-reservation-conversion/components/LectureReservationConversionClient";

export const metadata = {
  title: "강의 → 예약 전환 | 알고가 통계 관리자",
  description: "통계 관리자가 강의의 예약 전환 지표를 확인하는 화면입니다.",
};

export default function StatisticCourseReservationConversionPage() {
  return <LectureReservationConversionClient />;
}
