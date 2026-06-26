"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { getLatestDiagnoses, getMyCourses } from "@/features/services/myCourse.service";
import { LatestDiagnosisResult, MyCourse, PageResponse } from "./types";

const PAGE_SIZE = 10;

export function useMyCourses() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [coursePage, setCoursePage] = useState<PageResponse<MyCourse> | null>(null);
  const [latestDiagnoses, setLatestDiagnoses] = useState<LatestDiagnosisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [coursesResult, diagnosesResult] = await Promise.allSettled([
        getMyCourses(page, PAGE_SIZE),
        getLatestDiagnoses(),
      ]);

      if (coursesResult.status === "rejected") {
        throw coursesResult.reason;
      }

      setCoursePage(coursesResult.value);

      if (diagnosesResult.status === "fulfilled") {
        setLatestDiagnoses(diagnosesResult.value);
      } else {
        setLatestDiagnoses([]);
      }
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        router.replace("/auth/login");
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "수강 강의를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    void load();

    window.addEventListener("course-completion-changed", load);

    return () => {
      window.removeEventListener("course-completion-changed", load);
    };
  }, [load]);

  const markReviewWritten = (courseId: number) => {
    setCoursePage((previous) =>
      previous
        ? {
            ...previous,
            content: previous.content.map((course) =>
              course.courseId === courseId
                ? { ...course, reviewWritten: true }
                : course
            ),
          }
        : previous
    );
  };

  return {
    courses: coursePage?.content ?? [],
    pagination: coursePage,
    page,
    setPage,
    latestDiagnoses,
    isLoading,
    errorMessage,
    refresh: load,
    markReviewWritten,
  };
}