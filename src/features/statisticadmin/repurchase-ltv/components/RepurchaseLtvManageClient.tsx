"use client";

import { useState } from "react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { downloadTopCustomersCsv } from "@/features/services/adminRepurchaseLtvStatistics.service";
import { useRepurchaseLtvStatistics } from "../hooks/useRepurchaseLtvStatistics";
import { repurchaseLtvPeriodLabels, repurchaseLtvPeriods } from "../utils";
import CohortLtvLineChart from "./CohortLtvLineChart";
import CohortRetentionHeatmap from "./CohortRetentionHeatmap";
import RepurchaseLtvSummaryCards from "./RepurchaseLtvSummaryCards";
import TopCustomerTable from "./TopCustomerTable";

const periodOptions = repurchaseLtvPeriods.map((period) => ({
  label: repurchaseLtvPeriodLabels[period],
  value: period,
}));

export default function RepurchaseLtvManageClient() {
  const { selectedPeriod, setSelectedPeriod, query, data, isLoading, error } =
    useRepurchaseLtvStatistics();
  const [csvError, setCsvError] = useState("");
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);

  const handleDownloadCsv = async () => {
    if (isDownloadingCsv) return;

    try {
      setIsDownloadingCsv(true);
      setCsvError("");
      await downloadTopCustomersCsv(query);
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
          title="재구매 · 고객가치 (LTV)"
          description="고객이 얼마나 반복 구매하고 장기적으로 얼마나 기여하는가"
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
        <LoadingSpinner text="재구매·LTV 현황을 불러오는 중입니다..." />
      ) : data ? (
        <>
          <RepurchaseLtvSummaryCards summary={data.summary} />

          <section className="mt-6 flex flex-col gap-6">
            <CohortRetentionHeatmap data={data.cohorts} maxMonths={data.maxMonths} />
            <CohortLtvLineChart data={data.cohorts} maxMonths={data.maxMonths} />
          </section>

          <TopCustomerTable data={data.topCustomers} onDownloadCsv={handleDownloadCsv} />
        </>
      ) : null}
    </main>
  );
}
