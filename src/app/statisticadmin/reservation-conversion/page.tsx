import type { Metadata } from "next";
import ReservationConversionManageClient from "@/features/statisticadmin/reservation-conversion/components/ReservationConversionManageClient";

export const metadata: Metadata = {
  title: "예약 전환율 분석 | 알고가 통계 관리자",
  description: "통계 관리자가 기간별 예약 시도, 완료, 상품별 전환율을 분석하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatisticAdminReservationConversionPage() {
  return <ReservationConversionManageClient />;
}
