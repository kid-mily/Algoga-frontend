"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { useSignupPathStatistics } from "../hooks/useSignupPathStatistics";
import { formatNumber, formatWon, signupPathPeriodLabels, signupPathPeriods } from "../utils";
import SignupPathNetSalesBarChart from "./SignupPathNetSalesBarChart";
import SignupPathPieChart from "./SignupPathPieChart";
import SignupPathSummaryCards from "./SignupPathSummaryCards";
import SignupPathTable from "./SignupPathTable";

const periodOptions = signupPathPeriods.map((period) => ({
  label: signupPathPeriodLabels[period],
  value: period,
}));

export default function UserSignupPathStatisticsManageClient() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    pathCounts,
    channelRevenue,
    summary,
    isLoadingCounts,
    isLoadingOverview,
    error,
  } = useSignupPathStatistics();

  return (
    <main aria-label="유저 유입 경로 통계">
      <SimpleSubHeader
        title="유입경로별 전환"
        description={`총가입자 ${formatNumber(
          summary.totalSignupCount
        )}명 | 총 순매출 ${formatWon(
          summary.totalNetSales
        )} | 최고 효율 경로 ${summary.bestEfficiencyPathLabel}`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <SignupPathSummaryCards summary={summary} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        <p className="text-[12px] text-[#98A2B3]">
          가입일 기준 기간 필터입니다. 유입경로 비율·상세통계에만 적용되며,
          대시보드 요약과 순매출 차트는 전체 기간 기준입니다.
        </p>
      </div>

      <section className="mb-5 grid grid-cols-2 gap-5">
        <SignupPathPieChart
          statistics={pathCounts}
          isLoading={isLoadingCounts}
        />

        <SignupPathNetSalesBarChart
          channelRevenue={channelRevenue}
          isLoading={isLoadingOverview}
        />
      </section>

      <SignupPathTable pathCounts={pathCounts} isLoading={isLoadingCounts} />
    </main>
  );
}
