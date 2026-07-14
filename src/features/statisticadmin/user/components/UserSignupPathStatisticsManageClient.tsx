"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import { useSignupPathStatistics } from "../hooks/useSignupPathStatistics";
import { formatNumber, formatWon } from "../utils";
import SignupPathNetSalesBarChart from "./SignupPathNetSalesBarChart";
import SignupPathPeriodFilter from "./SignupPathPeriodFilter";
import SignupPathPieChart from "./SignupPathPieChart";
import SignupPathSummaryCards from "./SignupPathSummaryCards";
import SignupPathTable from "./SignupPathTable";

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

      <SignupPathPeriodFilter
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

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
