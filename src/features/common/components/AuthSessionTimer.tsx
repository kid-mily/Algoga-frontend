"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthSession, refreshAuthSession } from "@/features/services/auth.service";
import { ApiRequestError } from "@/lib/api";
import CompleteModal from "./CompleteModal";

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export default function AuthSessionTimer() {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isExtending, setIsExtending] = useState(false);
  const [modalState, setModalState] = useState<{
    open: boolean;
    title: string;
    description: string;
    shouldRedirectToLogin?: boolean;
  }>({
    open: false,
    title: "",
    description: "",
  });

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

  // 세션 연장 버튼
  const handleExtendSession = async () => {
    try {
      setIsExtending(true);
      await refreshAuthSession();
      await loadSession();
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        setModalState({
          open: true,
          title: "세션 만료",
          description: "세션이 만료되었습니다. 다시 로그인해주세요.",
          shouldRedirectToLogin: true,
        });
        return;
      }

    } finally {
      setIsExtending(false);
    }
  };

  // 모달 확인 버튼 클릭했을 때
  const handleModalConfirm = () => {
    const shouldRedirectToLogin = modalState.shouldRedirectToLogin;
    setModalState({
      open: false,
      title: "",
      description: "",
    });

    if (!shouldRedirectToLogin) return;

    window.dispatchEvent(
      new CustomEvent("auth-state-changed", {
        detail: { isLoggedIn: false },
      })
    );
    router.push("/auth/login");
  };

  if (remainingSeconds === null) return null;

  return (
    <>
      <CompleteModal
        open={modalState.open}
        title={modalState.title}
        description={modalState.description}
        buttonText="확인"
        onConfirm={handleModalConfirm}
      />

      <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
        <span>세션 {formatTime(remainingSeconds)}</span>
        <span className="text-[#D0D5DD]">|</span>
        <button
          type="button"
          onClick={handleExtendSession}
          disabled={isExtending}
          className="cursor-pointer text-xs font-bold text-[#111827] transition hover:text-[#439A97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExtending ? "연장 중" : "연장"}
        </button>
      </div>
    </>
  );
}
