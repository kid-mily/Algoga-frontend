"use client";

import dynamic from "next/dynamic";

import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import ChartSkeleton from "@/features/statisticadmin/common/components/ChartSkeleton";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { useBalanceManagement } from "../hooks/useBalanceManagement";
import { balancePeriodLabels, balancePeriods } from "../utils";
import BalanceSummaryCards from "./BalanceSummaryCards";
import OutstandingReservationTable from "./OutstandingReservationTable";

const BalanceRecoveryLineChart = dynamic(
  () => import("./BalanceRecoveryLineChart"),
  { ssr: false, loading: () => <ChartSkeleton height={260} /> },
);
const CountryBalanceConversionBarChart = dynamic(
  () => import("./CountryBalanceConversionBarChart"),
  { ssr: false, loading: () => <ChartSkeleton height={260} /> },
);

const periodOptions = balancePeriods.map((period) => ({
  label: balancePeriodLabels[period],
  value: period,
}));

export default function BalanceManagementClient() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    search,
    setSearch,
    data,
    isLoading,
    isUnpaidLoading,
    error,
    downloadCsv,
  } = useBalanceManagement();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="flex items-start justify-between gap-4">
        <SimpleSubHeader
          title="잔금 관리"
          description="예약 잔금 납부 현황 및 미수금 추적"
        />

        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </section>

      {isLoading ? (
        <BalanceStateMessage message="잔금 관리 현황을 불러오는 중입니다..." />
      ) : error ? (
        <BalanceStateMessage message={error} />
      ) : data ? (
        <>
          <BalanceSummaryCards summary={data.summary} />

          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <BalanceRecoveryLineChart data={data.recoveryRates} />
            <CountryBalanceConversionBarChart data={data.countryConversions} />
          </section>

          <section className="mt-6">
            <OutstandingReservationTable
              data={data.outstandingReservations}
              search={search}
              onSearchChange={setSearch}
              isLoading={isUnpaidLoading}
              onDownloadCsv={downloadCsv}
            />
          </section>
        </>
      ) : (
        <BalanceStateMessage message="잔금 관리 데이터가 없습니다." />
      )}
    </main>
  );
}

function BalanceStateMessage({ message }: { message: string }) {
  return (
    <section className="mx-6 mt-8 rounded-[18px] border border-[#EAECF0] bg-white p-14 text-center text-[14px] font-semibold text-[#667085] shadow-sm">
      {message}
    </section>
  );
}
