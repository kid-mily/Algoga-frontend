"use client";

import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useReviewList } from "../hooks/useReviewList";
import ReviewDeleteModals from "./ReviewDeleteModals";
import ReviewList from "./ReviewList";
import ReviewPagination from "./ReviewPagination";
import ReviewToolbar from "./ReviewToolbar";

export default function ReviewManageClient() {
  const {
    courses,
    selectedCourseId,
    searchKeyword,
    selectedScore,
    filteredReviews,
    deleteTarget,
    deleteCompleteOpen,
    visibilityTarget,
    visibilityCompleteOpen,
    isLoading,
    isProcessing,
    error,
    setSelectedCourseId,
    setSearchKeyword,
    setSelectedScore,
    setDeleteTarget,
    setDeleteCompleteOpen,
    setVisibilityTarget,
    setVisibilityCompleteOpen,
    deleteReview,
    updateVisibility,
  } = useReviewList();

  return (
    <main aria-labelledby="review-management-title">
      <SimpleSubHeader
        title="후기 관리"
        description="강의 수료 학생의 후기를 조회하고 관리합니다"
      />

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[14px] font-semibold text-[#DC2626]"
        >
          {error}
        </p>
      )}

      <ReviewToolbar
        courses={courses}
        selectedCourseId={selectedCourseId}
        searchKeyword={searchKeyword}
        selectedScore={selectedScore}
        onSelectedCourseChange={setSelectedCourseId}
        onSearchKeywordChange={setSearchKeyword}
        onSelectedScoreChange={setSelectedScore}
      />

      <ReviewList
        reviews={filteredReviews}
        isLoading={isLoading}
        onVisibilityChange={setVisibilityTarget}
        onDelete={setDeleteTarget}
      />
      <ReviewPagination />

      <ReviewDeleteModals
        deleteTarget={deleteTarget}
        deleteCompleteOpen={deleteCompleteOpen}
        visibilityTarget={visibilityTarget}
        visibilityCompleteOpen={visibilityCompleteOpen}
        isProcessing={isProcessing}
        onConfirmDelete={deleteReview}
        onCancelDelete={() => setDeleteTarget(null)}
        onCloseComplete={() => setDeleteCompleteOpen(false)}
        onConfirmVisibility={updateVisibility}
        onCancelVisibility={() => setVisibilityTarget(null)}
        onCloseVisibilityComplete={() => setVisibilityCompleteOpen(false)}
      />
    </main>
  );
}
