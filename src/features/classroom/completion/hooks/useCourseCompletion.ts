"use client";

import { getMyCourses } from "@/features/services/myCourse.service";
import { ApiRequestError } from "@/lib/api";
import { CourseCompletion, CourseCompletionStatus } from "../types";
import { useCallback, useEffect, useState } from "react";
import { getMyCoupons, getMyMileages } from "@/features/services/myBenefit.service";
import { completeCourse } from "@/features/services/courseCompletion.service";

interface CompletionErrorBody {
  code?: string;
  errorCode?: string;
  message?: string;
}

interface MyCourseItem {
  courseId: string | number;
  learningStatus: "IN_PROGRESS" | "COMPLETED";
}

interface MyCoursesResponse {
  data?: MyCourseItem[];
}

// 오류 코드 추출
const getCompletionErrorCode = (
  error: ApiRequestError
) => {
  const body =
    error.body as CompletionErrorBody | null;

  return (
    error.code ||
    body?.errorCode ||
    body?.code ||
    ""
  );
};

// 내 강의 배열 조회
const getMyCourseList = async (): Promise<
  MyCourseItem[]
> => {
  const response =
    (await getMyCourses()) as unknown;

  if (Array.isArray(response)) {
    return response as MyCourseItem[];
  }

  const responseObject =
    response as MyCoursesResponse;

  return Array.isArray(responseObject.data)
    ? responseObject.data
    : [];
};

export function useCourseCompletion(
  courseId: string
) {
  const [status, setStatus] =
    useState<CourseCompletionStatus>("idle");

  const [completion, setCompletion] =
    useState<CourseCompletion | null>(null);

  const [message, setMessage] = useState("");

  // 현재 강의 수료 여부 확인
  const checkCompletionStatus =
    useCallback(async () => {
      if (!courseId) return false;

      const courses = await getMyCourseList();

      const currentCourse = courses.find(
        (course) =>
          String(course.courseId) ===
          String(courseId)
      );

      const isCompleted =
        currentCourse?.learningStatus ===
        "COMPLETED";

      if (isCompleted) {
        setStatus("completed");
        setMessage(
          "이미 수료 완료된 강의입니다."
        );
      }

      return isCompleted;
    }, [courseId]);

  // 혜택 및 강의 정보 갱신
  const refreshLearningData =
    useCallback(async () => {
      const results = await Promise.allSettled([
        getMyCoupons(),
        getMyMileages(),
        getMyCourses(),
      ]);

      const names = [
        "쿠폰",
        "마일리지",
        "내 강의",
      ];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `[course-completion] ${names[index]} 재조회 실패:`,
            result.reason
          );
        }
      });

      window.dispatchEvent(
        new CustomEvent(
          "learning-benefits-updated"
        )
      );
    }, []);

  // 페이지 진입 시 수료 여부 확인
  useEffect(() => {
    if (!courseId) return;

    let active = true;

    const loadCompletionStatus = async () => {
      try {
        const courses = await getMyCourseList();

        if (!active) return;

        const currentCourse = courses.find(
          (course) =>
            String(course.courseId) ===
            String(courseId)
        );

        if (
          currentCourse?.learningStatus ===
          "COMPLETED"
        ) {
          setStatus("completed");
          setMessage(
            "이미 수료 완료된 강의입니다."
          );
        }
      } catch (error) {
        console.error(
          "[course-completion] 수료 상태 조회 실패:",
          error
        );
      }
    };

    loadCompletionStatus();

    return () => {
      active = false;
    };
  }, [courseId]);

  // 강의 수료 처리
  const handleComplete =
    useCallback(async () => {
      if (
        !courseId ||
        status === "processing" ||
        status === "completed" ||
        status === "already-completed"
      ) {
        return;
      }

      try {
        setStatus("processing");
        setMessage(
          "강의 수료를 처리하고 있습니다."
        );

        const result =
          await completeCourse(courseId);

        setCompletion(result);
        setStatus("completed");
        setMessage(
          "수료가 완료되었습니다. 쿠폰과 마일리지가 자동 지급됩니다."
        );

        await refreshLearningData();
      } catch (error) {
        console.error(
          "[course-completion] 수료 처리 실패:",
          error
        );

        if (error instanceof ApiRequestError) {
          const code =
            getCompletionErrorCode(error);

          if (code === "LMS_017") {
            setStatus("already-completed");
            setMessage(
              "이미 수료 완료된 강의입니다."
            );

            await refreshLearningData();
            await checkCompletionStatus();
            return;
          }

          if (code === "LMS_015") {
            setStatus("failed");
            setMessage(
              "모든 챕터를 완료한 후 수료할 수 있습니다."
            );
            return;
          }

          if (code === "LMS_018") {
            setStatus("failed");
            setMessage(
              "퀴즈를 제출한 후 수료할 수 있습니다."
            );
            return;
          }

          if (code === "LMS_001") {
            setStatus("failed");
            setMessage(
              "해당 강의를 찾을 수 없습니다."
            );
            return;
          }

          setStatus("failed");
          setMessage(
            error.message ||
              "강의 수료 처리에 실패했습니다."
          );
          return;
        }

        setStatus("failed");
        setMessage(
          "강의 수료 처리에 실패했습니다."
        );
      }
    }, [
      courseId,
      status,
      checkCompletionStatus,
      refreshLearningData,
    ]);

  return {
    status,
    completion,
    message,
    isProcessing: status === "processing",
    isCompleted:
      status === "completed" ||
      status === "already-completed",
    handleComplete,
  };
}