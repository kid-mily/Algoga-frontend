"use client";

import { useEffect, useState } from "react";
import { getLectureCountriesAction, getLectureDetailAction } from "../actions";
import { AdminCourseRecord, CourseCountry } from "../types";

export function useAdminLectureDetail(lectureId: number) {
  const [lecture, setLecture] = useState<AdminCourseRecord | null>(null);
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [data, countryData] = await Promise.all([
          getLectureDetailAction(lectureId),
          getLectureCountriesAction(),
        ]);
        setLecture(data);
        setCountries(countryData);
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

  return { lecture, countries, isLoading, error };
}
