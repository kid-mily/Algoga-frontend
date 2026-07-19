"use client";

import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { useBalanceManagement } from "../hooks/useBalanceManagement";
import { balancePeriodLabels, balancePeriods } from "../utils";
import BalanceRecoveryLineChart from "./BalanceRecoveryLineChart";
import BalanceSummaryCards from "./BalanceSummaryCards";
import CountryBalanceConversionBarChart from "./CountryBalanceConversionBarChart";
import OutstandingReservationTable from "./OutstandingReservationTable";

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
