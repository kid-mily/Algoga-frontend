"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useCouponStatistics } from "../hooks/useCouponStatistics";
import { formatPercent } from "../utils";
import CouponStatisticsSummaryCards from "./CouponStatisticsSummaryCards";
import CouponStatisticsTable from "./CouponStatisticsTable";
import CouponStatisticsToolbar from "./CouponStatisticsToolbar";

export default function CouponStatisticsManageClient() {
  const {
    summary,
    filteredStatistics,
    searchKeyword,
    isLoading,
    error,
    setSearchKeyword,
  } = useCouponStatistics();

  return (
    <main aria-label="쿠폰 사용 현황 조회">
      <SimpleSubHeader
        title="쿠폰 사용 현황 조회"
        description={`쿠폰 정책 ${summary.totalPolicyCount}개 | 발급 ${summary.totalIssuedCount.toLocaleString()}건 | 평균 사용률 ${formatPercent(summary.averageUsageRate)}`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <div className="mb-5">
        <CouponStatisticsSummaryCards summary={summary} />
      </div>

      <CouponStatisticsToolbar
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
      />
      <CouponStatisticsTable
        statistics={filteredStatistics}
        isLoading={isLoading}
      />
    </main>
  );
}
