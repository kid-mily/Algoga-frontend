"use client";

import { useCallback, useEffect, useState } from "react";
import { getCourseQnas } from "@/features/services/courseQna.service";
import { CourseQna } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useCourseQnaList = (courseId: string) => {
  const [qnas, setQnas] = useState<CourseQna[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQnas = useCallback(async () => {
    if (!courseId) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await getCourseQnas(courseId);
      setQnas(data);
    } catch (fetchError: unknown) {
      setError(getErrorMessage(fetchError, "Q&A 목록을 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchQnas();
    });
  }, [fetchQnas]);

  return {
    qnas,
    isLoading,
    error,
    refetch: fetchQnas,
  };
};
