"use client";

import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { useRefundManagement } from "../hooks/useRefundManagement";
import { refundPeriodLabels, refundPeriods } from "../utils";
import CancellationStageDonutChart from "./CancellationStageDonutChart";
import CountryRefundRateTable from "./CountryRefundRateTable";
import RefundMonthlyTrendChart from "./RefundMonthlyTrendChart";
import RefundReasonTable from "./RefundReasonTable";
import RefundSummaryCards from "./RefundSummaryCards";
import RefundTimingDistribution from "./RefundTimingDistribution";

const periodOptions = refundPeriods.map((period) => ({
  label: refundPeriodLabels[period],
  value: period,
}));

export default function RefundManagementClient() {
  const { selectedPeriod, setSelectedPeriod, trendUnit, data, isLoading, error } =
    useRefundManagement();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="mx-6 flex items-start justify-between gap-4">
        <SimpleSubHeader
          title="환불 관리"
          description="환불·취소 현황 및 패턴 분석"
        />

        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </section>

      {isLoading ? (
        <RefundStateMessage message="환불 관리 현황을 불러오는 중입니다..." />
      ) : error ? (
        <RefundStateMessage message={error} />
      ) : data ? (
        <>
          <RefundSummaryCards summary={data.summary} />

          <section className="mx-6 mt-6">
            <RefundMonthlyTrendChart data={data.monthlyTrends} unit={trendUnit} />
          </section>

          <section className="mx-6 mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RefundTimingDistribution data={data.refundTimings} />
            <CancellationStageDonutChart data={data.cancellationStages} />
          </section>

          <section className="mx-6 mt-6 grid grid-cols-1 gap-6 pb-8 xl:grid-cols-2">
            <RefundReasonTable data={data.refundReasons} />
            <CountryRefundRateTable data={data.countryRefundRates} />
          </section>
        </>
      ) : (
        <RefundStateMessage message="환불 관리 데이터가 없습니다." />
      )}
    </main>
  );
}

function RefundStateMessage({ message }: { message: string }) {
  return (
    <section className="mx-6 mt-8 rounded-[18px] border border-[#EAECF0] bg-white p-14 text-center text-[14px] font-semibold text-[#667085] shadow-sm">
      {message}
    </section>
  );
}
