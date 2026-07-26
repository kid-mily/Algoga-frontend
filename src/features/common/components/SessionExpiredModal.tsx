"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CompleteModal from "@/features/common/components/CompleteModal";
import type { SessionExpirationReason } from "@/lib/sessionExpiration";

type SessionExpiredDetail = {
  loginPath?: string;
  reason?: SessionExpirationReason;
};

const DEFAULT_LOGIN_PATH = "/auth/login";
const DEFAULT_REASON: SessionExpirationReason = "INACTIVITY";

const SESSION_NOTICE: Record<
  SessionExpirationReason,
  { title: string; description: string }
> = {
  CONCURRENT_LOGIN: {
    title: "다른 기기에서 로그인되었습니다",
    description:
      "다른 기기에서 동일한 계정으로 로그인하여 현재 세션이 종료되었습니다.\n다시 로그인해주세요.",
  },
  INACTIVITY: {
    title: "세션이 만료되었습니다",
    description:
      "30분간 활동이 없어 자동으로 로그아웃되었습니다.\n다시 로그인해주세요.",
  },
};

export default function SessionExpiredModal() {
  const router = useRouter();
  const [sessionDetail, setSessionDetail] =
    useState<SessionExpiredDetail | null>(null);

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const sessionEvent = event as CustomEvent<SessionExpiredDetail>;
      setSessionDetail({
        loginPath: sessionEvent.detail?.loginPath || DEFAULT_LOGIN_PATH,
        reason: sessionEvent.detail?.reason || DEFAULT_REASON,
      });
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleMoveToLogin = () => {
    const nextLoginPath = sessionDetail?.loginPath || DEFAULT_LOGIN_PATH;
    setSessionDetail(null);
    router.replace(nextLoginPath);
  };

  const notice = SESSION_NOTICE[sessionDetail?.reason || DEFAULT_REASON];

  return (
    <CompleteModal
      open={Boolean(sessionDetail)}
      title={notice.title}
      description={notice.description}
      buttonText="로그인 화면으로 이동"
      onConfirm={handleMoveToLogin}
    />
  );
}
