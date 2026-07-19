"use client";

import { useState } from "react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { downloadCountryProfitCsv } from "@/features/services/adminCountryProfitStatistics.service";
import { useCountryProfitStatistics } from "../hooks/useCountryProfitStatistics";
import { countryProfitPeriodLabels, countryProfitPeriods } from "../utils";
import CountryNetSalesBarChart from "./CountryNetSalesBarChart";
import CountryProfitabilitySummaryCards from "./CountryProfitabilitySummaryCards";
import CountryProfitabilityTable from "./CountryProfitabilityTable";
import CountryRefundCancelCompareChart from "./CountryRefundCancelCompareChart";

const periodOptions = countryProfitPeriods.map((period) => ({
  label: countryProfitPeriodLabels[period],
  value: period,
}));

export default function CountryProfitabilitySummaryClient() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    search,
    setSearch,
    query,
    data,
    tableItems,
    isLoading,
    isTableLoading,
    error,
  } = useCountryProfitStatistics();
  const [csvError, setCsvError] = useState("");
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);

  const handleDownloadCsv = async () => {
    if (isDownloadingCsv) return;

    try {
      setIsDownloadingCsv(true);
      setCsvError("");
      await downloadCountryProfitCsv({ ...query, search });
    } catch (downloadError) {
      setCsvError(
        downloadError instanceof Error
          ? downloadError.message
          : "CSV 다운로드에 실패했습니다."
      );
    } finally {
      setIsDownloadingCsv(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="flex items-start justify-between gap-4">
        <SimpleSubHeader
          title="나라별 수익성 종합"
          description="나라별 매출과 수익성을 비교해 운영 전략을 수립"
        />

        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </section>

      <AdminErrorBanner message={error} className="mt-4" />
      <AdminErrorBanner message={csvError} className="mt-4" />

      {isLoading ? (
        <LoadingSpinner text="나라별 수익성 현황을 불러오는 중입니다..." />
      ) : data ? (
        <>
          <CountryProfitabilitySummaryCards summary={data.summary} />

          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <CountryNetSalesBarChart data={data.items} />
            <CountryRefundCancelCompareChart data={data.items} />
          </section>

          <CountryProfitabilityTable
            data={tableItems}
            search={search}
            onSearchChange={setSearch}
            isLoading={isTableLoading}
            onDownloadCsv={handleDownloadCsv}
          />
        </>
      ) : null}
    </main>
  );
}
