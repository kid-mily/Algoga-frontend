import { useMemo, useState } from "react";
import { AdminReview } from "../types";

export const useReviewList = (initialReviews: AdminReview[]) => {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedScore, setSelectedScore] = useState("전체");
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
  const [deleteCompleteOpen, setDeleteCompleteOpen] = useState(false);

  const filteredReviews = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    const score = selectedScore === "전체" ? null : Number(selectedScore[0]);

    return reviews.filter((review) => {
      const keywordMatched =
        !keyword ||
        review.packageName.toLowerCase().includes(keyword) ||
        review.user.toLowerCase().includes(keyword);
      const scoreMatched = score === null || Math.floor(review.rating) === score;

      return keywordMatched && scoreMatched;
    });
  }, [reviews, searchKeyword, selectedScore]);

  const deleteReview = () => {
    if (!deleteTarget) return;

    setReviews((prev) =>
      prev.filter((review) => review.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
    setDeleteCompleteOpen(true);
  };

  return {
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
  };
};
