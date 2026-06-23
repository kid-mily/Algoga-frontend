"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type {
  MyPageData,
  MyPageSummary,
  MyPageUser,
} from "@/features/mypage/types";
import {
  getMyPageData,
  MyPageApiError,
} from "@/features/services/mypage.service";

const initialSummary: MyPageSummary = {
  courseCount: 0,
  reservationCount: 0,
  couponCount: 0,
};

export function useMyPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<MyPageUser | null>(null);
  const [summary, setSummary] =
    useState(initialSummary);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const fetchMyPage = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data: MyPageData =
        await getMyPageData();

      setUser(data.user);
      setSummary(data.summary);
    } catch (error) {
      console.error("마이페이지 조회 실패:", error);

      if (
        error instanceof MyPageApiError &&
        (error.status === 401 ||
          error.status === 403)
      ) {
        router.replace("/auth/login");
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "마이페이지 정보를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchMyPage();
  }, [fetchMyPage]);

  return {
    user,
    summary,
    isLoading,
    errorMessage,
    refetch: fetchMyPage,
  };
}