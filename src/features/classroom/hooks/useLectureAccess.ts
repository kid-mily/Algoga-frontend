"use client";

import { useEffect, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { getCourseStudyDetail } from "@/features/services/courseStudy.service";
import { getMe } from "@/features/services/user.service";

interface UseLectureAccessOptions {
  courseId: string;
  fallbackCanStudy: boolean;
}

export function useLectureAccess({
  courseId,
  fallbackCanStudy,
}: UseLectureAccessOptions) {
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [canStudy, setCanStudy] = useState(fallbackCanStudy);

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      try {
        setIsCheckingAccess(true);
        setRequiresLogin(false);

        const user = await getMe();

        if (!isActive) return;

        if (!user) {
          setRequiresLogin(true);
          setCanStudy(false);
          return;
        }

        try {
          await getCourseStudyDetail(courseId);

          if (!isActive) return;

          setCanStudy(true);
        } catch (error) {
          if (!isActive) return;

          if (
            error instanceof ApiRequestError &&
            (error.status === 403 || error.status === 404)
          ) {
            setCanStudy(false);
            return;
          }

          console.error("[lecture-access] 수강 권한 확인 실패:", error);
          setCanStudy(fallbackCanStudy);
        }
      } catch (error) {
        if (!isActive) return;

        if (error instanceof ApiRequestError && error.status === 401) {
          setRequiresLogin(true);
          setCanStudy(false);
          return;
        }

        console.error("[lecture-access] 로그인 상태 확인 실패:", error);
        setRequiresLogin(true);
        setCanStudy(false);
      } finally {
        if (isActive) {
          setIsCheckingAccess(false);
        }
      }
    };

    void checkAccess();

    return () => {
      isActive = false;
    };
  }, [courseId, fallbackCanStudy]);

  return { isCheckingAccess, requiresLogin, canStudy };
}
