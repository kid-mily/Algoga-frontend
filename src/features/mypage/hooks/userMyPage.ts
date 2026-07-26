"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MyPageData } from "@/features/mypage/types";
import { getMyPageData } from "@/features/services/mypage.service";

export function useMyPage(initialData: MyPageData) {
  const [user, setUser] = useState(initialData.user);
  const [summary, setSummary] = useState(initialData.summary);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMyPage = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data: MyPageData =
        await getMyPageData({
          includeReservationCount: true,
        });

      setUser(data.user);
      setSummary(data.summary);
    } catch (error) {
      console.error("마이페이지 조회 실패:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "마이페이지 정보를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ nickname?: string; profileImageUrl?: string | null }>).detail;

      if (!detail) return;

      setUser((prev) =>
        prev
          ? {
              ...prev,
              nickname: detail.nickname ?? prev.nickname,
              profileImageUrl:
                detail.profileImageUrl === undefined
                  ? prev.profileImageUrl
                  : detail.profileImageUrl,
            }
          : prev
      );
    };

    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);

  return useMemo(
    () => ({
      user,
      summary,
      isLoading,
      errorMessage,
      refetch: fetchMyPage,
    }),
    [user, summary, isLoading, errorMessage, fetchMyPage]
  );
}
