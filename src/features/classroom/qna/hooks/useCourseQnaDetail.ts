"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCourseQnaComment,
  getCourseQna,
} from "@/features/services/courseQna.service";
import { CourseQna } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useCourseQnaDetail = (courseId: string, qnaId: string) => {
  const [qna, setQna] = useState<CourseQna | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQna = useCallback(async () => {
    if (!courseId || !qnaId) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await getCourseQna(courseId, qnaId);
      setQna(data);
    } catch (fetchError: unknown) {
      setError(getErrorMessage(fetchError, "Q&A 상세 내용을 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, qnaId]);

  const createComment = useCallback(
    async (content: string) => {
      try {
        setError("");
        await createCourseQnaComment(courseId, qnaId, { content });
        await fetchQna();
        return true;
      } catch (submitError: unknown) {
        setError(getErrorMessage(submitError, "댓글 등록에 실패했습니다."));
        return false;
      }
    },
    [courseId, qnaId, fetchQna]
  );

  useEffect(() => {
    queueMicrotask(() => {
      fetchQna();
    });
  }, [fetchQna]);

  return {
    qna,
    isLoading,
    error,
    createComment,
  };
};
