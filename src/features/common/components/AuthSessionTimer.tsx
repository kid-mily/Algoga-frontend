"use client";

import { useEffect, useState } from "react";
import { getAuthSession } from "@/features/services/auth.service";
import { ApiRequestError } from "@/lib/api";

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export default function AuthSessionTimer() {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  // 세션 정보 불러오기
  const loadSession = async (signal?: AbortSignal) => {
    try {
      const session = await getAuthSession(signal);
      setRemainingSeconds(Math.max(0, session.remainingSeconds));
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        setRemainingSeconds(null);
      }
    }
  };

  // 렌더링될 때 세션 조회
  useEffect(() => {
    const controller = new AbortController();

    void loadSession(controller.signal);

    const handleAuthStateChanged = () => {
      void loadSession();
    };

    window.addEventListener("auth-state-changed", handleAuthStateChanged);

    return () => {
      controller.abort();
      window.removeEventListener("auth-state-changed", handleAuthStateChanged);
    };
  }, []);

  // 타이머
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) =>
        prev === null ? null : Math.max(prev - 1, 0)
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [remainingSeconds]);

  if (remainingSeconds === null) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
      <span>세션 {formatTime(remainingSeconds)}</span>
    </div>
  );
}
