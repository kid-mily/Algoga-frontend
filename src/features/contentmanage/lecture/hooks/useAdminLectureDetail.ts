"use client";

import { useEffect, useState } from "react";
import { getLectureDetailAction } from "../actions";
import { AdminCourseRecord } from "../types";

export function useAdminLectureDetail(lectureId: number) {
  const [lecture, setLecture] = useState<AdminCourseRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getLectureDetailAction(lectureId);
        setLecture(data);
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : "강의 정보를 불러오지 못했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (lectureId) void fetchLecture();
  }, [lectureId]);

  return { lecture, isLoading, error };
}
