"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useCourseEnrollmentStatistics } from "../hooks/useCourseEnrollmentStatistics";
import { formatNumber, formatPercent } from "../utils";
import CourseEnrollmentPagination from "./CourseEnrollmentPagination";
import CourseEnrollmentSummaryCards from "./CourseEnrollmentSummaryCards";
import CourseEnrollmentTable from "./CourseEnrollmentTable";
import CourseEnrollmentToolbar from "./CourseEnrollmentToolbar";

export default function CourseEnrollmentManageClient() {
  const {
    courses,
    searchKeyword,
    currentPage,
    totalPages,
    totalElements,
    isLoading,
    error,
    summary,
    onSearchKeywordChange,
    onSearchSubmit,
    onPageChange,
  } = useCourseEnrollmentStatistics();

  return (
    <main aria-label="수강률 분석">
      <SimpleSubHeader
        title="수강률 분석"
        description={`강의 ${formatNumber(totalElements)}개 | 평균 진도율 ${formatPercent(summary.averageProgressRate)} | 평균 수료율 ${formatPercent(summary.averageCompletionRate)}`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <CourseEnrollmentSummaryCards summary={summary} />

      <CourseEnrollmentToolbar
        searchKeyword={searchKeyword}
        onSearchKeywordChange={onSearchKeywordChange}
        onSearchSubmit={onSearchSubmit}
      />

      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <CourseEnrollmentTable courses={courses} isLoading={isLoading} />
        <CourseEnrollmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={onPageChange}
        />
      </section>
    </main>
  );
}
