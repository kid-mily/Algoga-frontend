"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import { useCountryPopularity } from "../hooks/useCountryPopularity";
import { formatNumber, formatPercent, formatWon } from "../utils";
import CountryPopularitySummaryCards from "./CountryPopularitySummaryCards";
import CountryPopularityTable from "./CountryPopularityTable";
import CountryPopularityTopChart from "./CountryPopularityTopChart";
import CountryPopularityToolbar from "./CountryPopularityToolbar";

export default function CountryPopularityManageClient() {
  const {
    fromDate,
    toDate,
    filteredCountries,
    revenueTop10,
    summary,
    searchKeyword,
    isLoading,
    isDownloading,
    error,
    setFromDate,
    setToDate,
    setSearchKeyword,
    downloadCsv,
  } = useCountryPopularity();

  return (
    <main aria-label="나라별 인기도">
      <SimpleSubHeader
        title="나라별 인기도"
        description={`국가 ${formatNumber(summary.totalCountryCount)}개 | 가입 ${formatNumber(summary.totalSignupCount)}명 | 예약 ${formatNumber(summary.totalBookingCount)}건 | 평균 점유율 ${formatPercent(summary.averageShareRate)}`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <CountryPopularitySummaryCards summary={summary} />

      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <CountryPopularityTopChart
          title="매출 Top 10"
          countries={revenueTop10}
          isLoading={isLoading}
          metric="revenue"
        />

        <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5">
          <h2 className="text-[16px] font-bold text-[#111827]">요약</h2>
          <dl className="mt-4 space-y-3 text-[14px]">
            <div className="flex justify-between gap-4">
              <dt className="text-[#667085]">총 매출</dt>
              <dd className="font-bold text-[#111827]">
                {formatWon(summary.totalRevenue)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#667085]">평균 점유율</dt>
              <dd className="font-bold text-[#111827]">
                {formatPercent(summary.averageShareRate)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#667085]">예약 완료</dt>
              <dd className="font-bold text-[#111827]">
                {formatNumber(summary.totalBookingCount)}건
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <CountryPopularityToolbar
        fromDate={fromDate}
        toDate={toDate}
        searchKeyword={searchKeyword}
        isDownloading={isDownloading}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onSearchKeywordChange={setSearchKeyword}
        onCsvDownload={downloadCsv}
      />

      <CountryPopularityTable
        countries={filteredCountries}
        isLoading={isLoading}
      />
    </main>
  );
}

