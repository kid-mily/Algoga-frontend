"use client";

import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { downloadLectureCountryConversionCsv } from "@/features/services/adminLectureConversionStatistics.service";
import { useCourseReservationConversion } from "../hooks/useCourseReservationConversion";
import { lectureConversionPeriodLabels, lectureConversionPeriods } from "../utils";
import LectureConversionFunnel from "./LectureConversionFunnel";
import LectureConversionRankingCharts from "./LectureConversionRankingCharts";
import LectureConversionSummaryCards from "./LectureConversionSummaryCards";
import LectureCountryConversionTable from "./LectureCountryConversionTable";

const periodOptions = lectureConversionPeriods.map((period) => ({
  label: lectureConversionPeriodLabels[period],
  value: period,
}));

export default function LectureReservationConversionClient() {
  const { selectedPeriod, setSelectedPeriod, query, data, isLoading, error } =
    useCourseReservationConversion();

  const handleDownloadCsv = () => downloadLectureCountryConversionCsv(query);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="flex items-start justify-between gap-4">
        <SimpleSubHeader
          title="강의 → 예약 전환"
          description="단과 강의 수강이 실제 패키지 예약으로 이어지는가"
        />

        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </section>

      {isLoading ? (
        <ConversionStateMessage message="강의 → 예약 전환 현황을 불러오는 중입니다..." />
      ) : error ? (
        <ConversionStateMessage message={error} />
      ) : data ? (
        <>
          <LectureConversionSummaryCards summary={data.summary} />
          <LectureConversionFunnel data={data.funnel} summary={data.summary} />
          <LectureConversionRankingCharts
            topLectures={data.topLectures}
            bottomLectures={data.bottomLectures}
          />
          <LectureCountryConversionTable
            data={data.countries}
            onDownloadCsv={handleDownloadCsv}
          />
        </>
      ) : (
        <ConversionStateMessage message="강의 → 예약 전환 데이터가 없습니다." />
      )}
    </main>
  );
}

function ConversionStateMessage({ message }: { message: string }) {
  return (
    <section className="mt-8 rounded-[18px] border border-[#EAECF0] bg-white p-14 text-center text-[14px] font-semibold text-[#667085] shadow-sm">
      {message}
    </section>
  );
}
