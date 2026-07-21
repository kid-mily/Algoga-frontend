"use client";

import dynamic from "next/dynamic";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import ChartSkeleton from "@/features/statisticadmin/common/components/ChartSkeleton";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import { downloadInflowChannelsCsv } from "@/features/services/adminUserStatistics.service";
import { useSignupPathStatistics } from "../hooks/useSignupPathStatistics";
import {
  formatNumber,
  formatWon,
  getSignupPathDateRange,
  signupPathPeriodLabels,
  signupPathPeriods,
} from "../utils";
import SignupPathSummaryCards from "./SignupPathSummaryCards";
import SignupPathTable from "./SignupPathTable";

const SignupPathNetSalesBarChart = dynamic(
  () => import("./SignupPathNetSalesBarChart"),
  { ssr: false, loading: () => <ChartSkeleton height={300} /> },
);
const SignupPathPieChart = dynamic(() => import("./SignupPathPieChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height={300} />,
});

const periodOptions = signupPathPeriods.map((period) => ({
  label: signupPathPeriodLabels[period],
  value: period,
}));

export default function UserSignupPathStatisticsManageClient() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    channelRevenue,
    summary,
    isLoading,
    error,
  } = useSignupPathStatistics();

  const handleDownloadCsv = () =>
    downloadInflowChannelsCsv(getSignupPathDateRange(selectedPeriod));

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

      <div className="mb-5">
        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>

      <section className="mb-5 grid grid-cols-2 gap-5">
        <SignupPathPieChart statistics={channelRevenue} isLoading={isLoading} />

        <SignupPathNetSalesBarChart
          channelRevenue={channelRevenue}
          isLoading={isLoading}
          onDownloadCsv={handleDownloadCsv}
        />
      </section>

      <SignupPathTable channelRevenue={channelRevenue} isLoading={isLoading} />
    </main>
  );
}
