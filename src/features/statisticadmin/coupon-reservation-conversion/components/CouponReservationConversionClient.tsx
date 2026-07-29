"use client";

import dynamic from "next/dynamic";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import ChartSkeleton from "@/features/statisticadmin/common/components/ChartSkeleton";
import LectureCountryConversionTable from "@/features/statisticadmin/course-reservation-conversion/components/LectureCountryConversionTable";
import {
  ALL_TIME_QUERY,
  downloadCouponPerformanceCsv,
  downloadLectureCouponUsageCsv,
} from "@/features/services/adminCouponConversionStatistics.service";
import { downloadLectureCountryConversionCsv } from "@/features/services/adminLectureConversionStatistics.service";
import { useCouponConversion } from "../hooks/useCouponConversion";
import CouponConversionSummaryCards from "./CouponConversionSummaryCards";
import CouponPerformanceTable from "./CouponPerformanceTable";

const LectureCouponUsageChart = dynamic(
  () => import("./LectureCouponUsageChart"),
  { ssr: false, loading: () => <ChartSkeleton height={420} /> },
);

export default function CouponReservationConversionClient() {
  const { data, isLoading, error } = useCouponConversion();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <SimpleSubHeader
        title="쿠폰 → 예약 전환"
        description="쿠폰 사용이 실제 예약으로 이어지는가"
      />

      <AdminErrorBanner message={error} className="mt-4" />

      {isLoading ? (
        <LoadingSpinner text="쿠폰 → 예약 전환 현황을 불러오는 중입니다..." />
      ) : data ? (
        <>
          <CouponConversionSummaryCards summary={data.summary} />
          <LectureCouponUsageChart
            data={data.lectureUsage}
            onDownloadCsv={() => downloadLectureCouponUsageCsv(data.lectureUsage)}
          />
          <CouponPerformanceTable
            rows={data.performance}
            onDownloadCsv={() => downloadCouponPerformanceCsv(data.performance)}
          />
          <LectureCountryConversionTable
            data={data.countries}
            onDownloadCsv={() => downloadLectureCountryConversionCsv(ALL_TIME_QUERY)}
          />
        </>
      ) : null}
    </main>
  );
}
