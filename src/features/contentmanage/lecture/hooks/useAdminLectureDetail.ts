"use client";

import { useEffect, useState } from "react";
import { getLectureDetailAction } from "../actions";

export function useAdminLectureDetail(lectureId: number) {
  const [lecture, setLecture] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getLectureDetailAction(lectureId);
        setLecture(data);
      } catch (error: any) {
        setError(error.message || "강의 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (lectureId) fetchLecture();
  }, [lectureId]);

  return { lecture, isLoading, error };
}
