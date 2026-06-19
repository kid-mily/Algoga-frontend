import { useEffect, useMemo, useState } from "react";
import type { AdminCourse } from "@/features/contentmanage/lecture/types";
import { getAdminCourses } from "@/features/services/adminCourse.service";
import {
  deleteAdminCourseReview,
  getAdminCourseReviews,
  updateAdminCourseReviewVisibility,
} from "@/features/services/adminReview.service";
import { getErrorMessage } from "@/features/services/error.service";
import { AdminReview } from "../types";

export const useReviewList = () => {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedScore, setSelectedScore] = useState("전체");
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
  const [deleteCompleteOpen, setDeleteCompleteOpen] = useState(false);
  const [visibilityTarget, setVisibilityTarget] = useState<AdminReview | null>(null);
  const [visibilityCompleteOpen, setVisibilityCompleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      try {
        setError("");
        const data = await getAdminCourses(controller.signal);

        if (controller.signal.aborted) return;
        setCourses(data);
        setSelectedCourseId((prev) => prev ?? data[0]?.courseId ?? null);
        if (data.length === 0) {
          setIsLoading(false);
        }
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(loadError, "강의 목록을 불러오지 못했습니다."));
        setIsLoading(false);
      }
    };

    void loadCourses();

    return () => {
      controller.abort();
    };
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.courseId === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );

  useEffect(() => {
    if (!selectedCourse) {
      return;
    }

    const controller = new AbortController();

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAdminCourseReviews(selectedCourse, controller.signal);

        if (controller.signal.aborted) return;
        setReviews(data);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(loadError, "후기 목록을 불러오지 못했습니다."));
        setReviews([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      controller.abort();
    };
  }, [selectedCourse]);

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

  const deleteReview = async () => {
    if (!deleteTarget || isProcessing) return;

    try {
      setIsProcessing(true);
      setError("");
      await deleteAdminCourseReview(deleteTarget.courseId, deleteTarget.id);
      setReviews((prev) =>
        prev.filter((review) => review.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
      setDeleteCompleteOpen(true);
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
      setReviews((prev) =>
        prev.map((review) =>
          review.id === visibilityTarget.id
            ? { ...review, hidden: !review.hidden }
            : review
        )
      );
      setVisibilityTarget(null);
      setVisibilityCompleteOpen(true);
    } catch (visibilityError: unknown) {
      setError(getErrorMessage(visibilityError, "후기 숨김 상태 변경에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  return {
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
  };
};
