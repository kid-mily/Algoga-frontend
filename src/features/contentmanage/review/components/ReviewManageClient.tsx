"use client";

import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useReviewList } from "../hooks/useReviewList";
import { AdminReview } from "../types";
import ReviewDeleteModals from "./ReviewDeleteModals";
import ReviewList from "./ReviewList";
import ReviewPagination from "./ReviewPagination";
import ReviewToolbar from "./ReviewToolbar";

type ReviewManageClientProps = {
  initialReviews: AdminReview[];
};

export default function ReviewManageClient({
  initialReviews,
}: ReviewManageClientProps) {
  const {
    searchKeyword,
    selectedScore,
    filteredReviews,
    deleteTarget,
    deleteCompleteOpen,
    setSearchKeyword,
    setSelectedScore,
    setDeleteTarget,
    setDeleteCompleteOpen,
    deleteReview,
  } = useReviewList(initialReviews);

  return (
    <main aria-labelledby="review-management-title">
      <SimpleSubHeader
        title="후기 관리"
        description="강의 수료 학생의 후기를 조회하고 관리합니다"
      />

      <ReviewToolbar
        searchKeyword={searchKeyword}
        selectedScore={selectedScore}
        onSearchKeywordChange={setSearchKeyword}
        onSelectedScoreChange={setSelectedScore}
      />

      <ReviewList reviews={filteredReviews} onDelete={setDeleteTarget} />
      <ReviewPagination />

      <ReviewDeleteModals
        deleteTarget={deleteTarget}
        deleteCompleteOpen={deleteCompleteOpen}
        onConfirmDelete={deleteReview}
        onCancelDelete={() => setDeleteTarget(null)}
        onCloseComplete={() => setDeleteCompleteOpen(false)}
      />
    </main>
  );
}
