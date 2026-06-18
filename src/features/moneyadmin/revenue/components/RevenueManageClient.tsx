"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useRevenueStats } from "../hooks/useRevenueStats";
import { formatWon } from "../utils";
import RevenueStatsTable from "./RevenueStatsTable";
import RevenueSummaryCards from "./RevenueSummaryCards";

export default function RevenueManageClient() {
  const { stats, latestStat, totalNetAmount, isLoading, error } = useRevenueStats();

  return (
    <main aria-label="월별 수익 조회">
      <SimpleSubHeader
        title="월별 수익 조회"
        description={`조회 월 ${stats.length}개 | 누적 순수익 ${formatWon(totalNetAmount)}`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      {latestStat && (
        <div className="mb-5">
          <RevenueSummaryCards stat={latestStat} />
        </div>
      )}

      <RevenueStatsTable stats={stats} isLoading={isLoading} />
    </main>
  );
}
