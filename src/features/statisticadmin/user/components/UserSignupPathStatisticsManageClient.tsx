"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useSignupPathStatistics } from "../hooks/useSignupPathStatistics";
import { formatNumber, formatPercent } from "../utils";
import SignupPathFilterBar from "./SignupPathFilterBar";
import SignupPathPieChart from "./SignupPathPieChart";
import SignupPathSummaryCards from "./SignupPathSummaryCards";
import SignupPathTable from "./SignupPathTable";

export default function UserSignupPathStatisticsManageClient() {
  const {
    filteredStatistics,
    pathOptions,
    summary,
    searchKeyword,
    selectedPath,
    isLoading,
    error,
    setSearchKeyword,
    setSelectedPath,
  } = useSignupPathStatistics();

  return (
    <main aria-label="유저 유입 경로 통계">
      <SimpleSubHeader
        title="유저 유입 경로 통계"
        description={`가입 ${formatNumber(summary.totalSignupCount)}명 | 경로 ${formatNumber(summary.pathCount)}개 | 최다 유입 ${summary.topPathLabel} ${formatPercent(summary.topPathRatio)}`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <SignupPathSummaryCards summary={summary} />

      <SignupPathFilterBar
        pathOptions={pathOptions}
        selectedPath={selectedPath}
        searchKeyword={searchKeyword}
        onSelectedPathChange={setSelectedPath}
        onSearchKeywordChange={setSearchKeyword}
      />

      <section className="mb-5 grid grid-cols-2 gap-5">
        <SignupPathPieChart
          statistics={filteredStatistics}
          isLoading={isLoading}
        />

        <SignupPathTable
          statistics={filteredStatistics}
          isLoading={isLoading}
          compact
        />
      </section>

      <SignupPathTable
        statistics={filteredStatistics}
        isLoading={isLoading}
      />
    </main>
  );
}
