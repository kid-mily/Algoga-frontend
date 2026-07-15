"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import { downloadCountryProfitCsv } from "@/features/services/adminInterestStatistics.service";
import CountryCourseInterestSummaryCards from "./CountryCourseInterestSummaryCards";
import CountryInterestBarChart from "./CountryInterestBarChart";
import CourseInterestBarChart from "./CourseInterestBarChart";
import CountryDetailStatsTable from "./CountryDetailStatsTable";
import CourseCompletionAnalysisTable from "./CourseCompletionAnalysisTable";
import PopularCountryCourseRankingTable from "./PopularCountryCourseRankingTable";
import { useCountryCourseInterestStatistics } from "../hooks/useCountryCourseInterestStatistics";
import { interestPeriodLabels, interestPeriods } from "../utils";

const periodOptions = interestPeriods.map((period) => ({
  label: interestPeriodLabels[period],
  value: period,
}));

export default function CountryCourseInterestManageClient() {
  const {
    period,
    setPeriod,
    query,
    summary,
    countries,
    courses,
    countryDetails,
    courseCompletions,
    popularCourseRanks,
    courseKeyword,
    setCourseKeyword,
    isLoading,
    isCourseLoading,
    error,
  } = useCountryCourseInterestStatistics();

  const handleDownloadCsv = () => downloadCountryProfitCsv(query);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="flex items-start justify-between gap-4">
        <SimpleSubHeader
          title="나라·강의 관심도 분석"
          description="어떤 나라·강의에 관심을 보이는가"
        />
      </section>

      <AdminErrorBanner message={error} className="mt-6" />

      {isLoading ? (
        <LoadingSpinner text="나라·강의 관심도 통계를 불러오는 중입니다..." />
      ) : (
        <>
          <CountryCourseInterestSummaryCards summary={summary} />

          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-[20px] font-bold text-[#111827]">
              <span className="h-6 w-1 rounded-full bg-[#2FAE9B]" />
              국가별 분석
            </h2>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <CountryInterestBarChart data={countries} />
              <CourseInterestBarChart data={courses} />
            </section>
          </section>

          <section className="mt-10">
            <CountryDetailStatsTable
              data={countryDetails}
              onDownloadCsv={handleDownloadCsv}
            />
          </section>

          <CourseCompletionAnalysisTable
            data={courseCompletions}
            keyword={courseKeyword}
            isLoading={isCourseLoading}
            onKeywordChange={setCourseKeyword}
          />
          <PopularCountryCourseRankingTable data={popularCourseRanks} />
        </>
      )}
    </main>
  );
}
