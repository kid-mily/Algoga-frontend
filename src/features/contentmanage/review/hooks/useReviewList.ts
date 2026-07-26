import { useCallback, useEffect, useState } from "react";
import type { AdminCourse } from "@/features/contentmanage/lecture/types";
import { getAdminCourses } from "@/features/services/adminCourse.service";
import {
  deleteAdminCourseReview,
  getAdminCourseReviewPage,
  updateAdminCourseReviewVisibility,
} from "@/features/services/adminReview.service";
import { getErrorMessage } from "@/features/services/error.service";
import { AdminReview } from "../types";

const PAGE_SIZE = 10;

export const useReviewList = () => {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedCourseId, setSelectedCourseIdState] = useState<number | null>(null);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [selectedScore, setSelectedScoreState] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
  const [deleteCompleteOpen, setDeleteCompleteOpen] = useState(false);
  const [visibilityTarget, setVisibilityTarget] = useState<AdminReview | null>(null);
  const [visibilityCompleteOpen, setVisibilityCompleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void getAdminCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const score =
        selectedScore === "전체" ? undefined : Number(selectedScore[0]);
      const data = await getAdminCourseReviewPage({
        page: currentPage - 1,
        size: PAGE_SIZE,
        courseId: selectedCourseId ?? undefined,
        rating: score,
      });
      setReviews(data.content);
      setTotalPages(Math.max(data.totalPages, 1));
      setTotalElements(data.totalElements);
    } catch (loadError: unknown) {
      setError(getErrorMessage(loadError, "후기 목록을 불러오지 못했습니다."));
      setReviews([]);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCourseId, selectedScore]);

  useEffect(() => {
    queueMicrotask(() => void loadReviews());
  }, [loadReviews]);

  const deleteReview = async () => {
    if (!deleteTarget || isProcessing) return;
    try {
      setIsProcessing(true);
      setError("");
      await deleteAdminCourseReview(deleteTarget.courseId, deleteTarget.id);
      setDeleteTarget(null);
      setDeleteCompleteOpen(true);
      await loadReviews();
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError, "후기 삭제에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  const updateVisibility = async () => {
    if (!visibilityTarget || isProcessing) return;
    try {
      setIsProcessing(true);
      setError("");
      await updateAdminCourseReviewVisibility(
        visibilityTarget.courseId,
        visibilityTarget.id,
        !visibilityTarget.hidden
      );
      setVisibilityTarget(null);
      setVisibilityCompleteOpen(true);
      await loadReviews();
    } catch (visibilityError: unknown) {
      setError(getErrorMessage(visibilityError, "후기 숨김 상태 변경에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  const setSelectedCourseId = (value: number | null) => {
    setSelectedCourseIdState(value);
    setCurrentPage(1);
  };
  const setSelectedScore = (value: string) => {
    setSelectedScoreState(value);
    setCurrentPage(1);
  };

  return {
    courses,
    selectedCourseId,
    selectedScore,
    filteredReviews: reviews,
    currentPage,
    totalPages,
    totalElements,
    deleteTarget,
    deleteCompleteOpen,
    visibilityTarget,
    visibilityCompleteOpen,
    isLoading,
    isProcessing,
    error,
    setCurrentPage,
    setSelectedCourseId,
    setSelectedScore,
    setDeleteTarget,
    setDeleteCompleteOpen,
    setVisibilityTarget,
    setVisibilityCompleteOpen,
    deleteReview,
    updateVisibility,
  };
};
