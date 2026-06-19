import type { Metadata } from "next";
import CouponStatisticsManageClient from "@/features/statisticadmin/coupon/components/CouponStatisticsManageClient";

export const metadata: Metadata = {
  title: "쿠폰 사용 현황 조회 | 알고가 통계 관리자",
  description: "통계 관리자가 쿠폰 발급, 사용, 만료 현황을 조회하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatisticAdminCouponsPage() {
  return <CouponStatisticsManageClient />;
}
