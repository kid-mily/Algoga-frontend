"use client";

import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { downloadSalesOverviewCsv } from "@/features/services/adminSalesOverview.service";
import { useSalesOverview } from "../hooks/useSalesOverview";
import { periodLabels, salesOverviewPeriods } from "../utils/salesOverviewFormatters";
import SalesOverviewLineChart from "./SalesOverviewLineChart";
import SalesOverviewSummaryCards from "./SalesOverviewSummaryCards";
import SalesOverviewTable from "./SalesOverviewTable";

const periodOptions = salesOverviewPeriods.map((period) => ({
  label: periodLabels[period],
  value: period,
}));

export default function SalesFinanceManageClient() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    query,
    overview,
    trend,
    isLoading,
    error,
  } = useSalesOverview();

  const handleDownloadCsv = () => downloadSalesOverviewCsv(query);

  return (
    <main aria-label="재무 현황" className="space-y-6">
      <header className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-bold text-[#101828]">재무 현황</h1>
          <p className="mt-2 text-[13px] font-medium text-[#98A2B3]">
            현재 서비스 전체 매출 상태
          </p>
        </div>

        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </header>

      {isLoading ? (
        <SalesOverviewStateMessage message="재무 현황을 불러오는 중입니다..." />
      ) : error ? (
        <SalesOverviewStateMessage message={error} />
      ) : overview ? (
        <>
          <SalesOverviewSummaryCards summary={overview} />
          <SalesOverviewLineChart trend={trend} />
          <SalesOverviewTable
            monthlyStats={overview.monthlyStats}
            onDownloadCsv={handleDownloadCsv}
          />
        </>
      ) : (
        <SalesOverviewStateMessage message="재무 현황 데이터가 없습니다." />
      )}
    </main>
  );
}

function SalesOverviewStateMessage({ message }: { message: string }) {
  return (
    <section className="rounded-[18px] border border-[#EAECF0] bg-white p-14 text-center text-[14px] font-semibold text-[#667085] shadow-[0_12px_28px_rgba(16,24,40,0.05)]">
      {message}
    </section>
  );
}
