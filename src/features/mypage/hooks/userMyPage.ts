"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();

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
        await getMyPageData({
          includeReservationCount: pathname === "/mypage",
        });

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
  }, [router, pathname]);

  useEffect(() => {
    void fetchMyPage();
  }, [fetchMyPage]);

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

  return {
    user,
    summary,
    isLoading,
    errorMessage,
    refetch: fetchMyPage,
  };
}