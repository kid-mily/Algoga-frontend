"use client";

import { useEffect, useMemo, useState } from "react";
import { getCourseReservationConversionData } from "@/features/services/adminLectureConversionStatistics.service";
import { ApiRequestError } from "@/lib/api";
import { CourseReservationConversionData, LectureConversionPeriod } from "../types";
import { getLectureConversionDateRange } from "../utils";

export const useCourseReservationConversion = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<LectureConversionPeriod>("thisMonth");
  const [data, setData] = useState<CourseReservationConversionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getLectureConversionDateRange(selectedPeriod),
    [selectedPeriod]
  );

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getCourseReservationConversionData(
          query,
          controller.signal
        );

        if (controller.signal.aborted) return;
        setData(result);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setData(null);
        setError(
          loadError instanceof ApiRequestError
            ? loadError.message
            : "강의 → 예약 전환 현황을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, [query]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    query,
    data,
    isLoading,
    error,
  };
};
