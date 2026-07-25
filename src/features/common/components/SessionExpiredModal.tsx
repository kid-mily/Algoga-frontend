"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CompleteModal from "@/features/common/components/CompleteModal";

type SessionExpiredDetail = {
  loginPath?: string;
};

const DEFAULT_LOGIN_PATH = "/auth/login";

export default function SessionExpiredModal() {
  const router = useRouter();
  const [loginPath, setLoginPath] = useState("");

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const sessionEvent = event as CustomEvent<SessionExpiredDetail>;
      setLoginPath(sessionEvent.detail?.loginPath || DEFAULT_LOGIN_PATH);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleMoveToLogin = () => {
    const nextLoginPath = loginPath || DEFAULT_LOGIN_PATH;
    setLoginPath("");
    router.replace(nextLoginPath);
  };

  return (
    <CompleteModal
      open={Boolean(loginPath)}
      title="세션이 만료되었습니다"
      description={"로그인 후 30분이 지나 자동으로 로그아웃되었습니다.\n다시 로그인해주세요."}
      buttonText="로그인 화면으로 이동"
      onConfirm={handleMoveToLogin}
    />
  );
}
