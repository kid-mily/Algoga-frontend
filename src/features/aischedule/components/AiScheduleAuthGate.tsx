"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/features/common/components/Modal";
import { getMe } from "@/features/services/user.service";

interface AiScheduleAuthGateProps {
  redirectPath: string;
  children: ReactNode;
}

// AI 일정 추천은 로그인 유저 전용 기능이라, 진입 시점에 로그인 여부부터 확인한다
export default function AiScheduleAuthGate({
  redirectPath,
  children,
}: AiScheduleAuthGateProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authed" | "guest">(
    "checking"
  );

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    getMe(controller.signal)
      .then((me) => {
        if (!active) return;
        setStatus(me ? "authed" : "guest");
      })
      .catch((error) => {
        if (!active || controller.signal.aborted) return;
        console.error("[aischedule] 로그인 상태 확인 실패:", error);
        setStatus("guest");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F8FC]">
        <p className="text-sm font-medium text-[#8A9BB0]">
          로그인 확인 중입니다...
        </p>
      </main>
    );
  }

  if (status === "guest") {
    const loginHref = `/auth/login?redirect=${encodeURIComponent(
      redirectPath
    )}`;

    return (
      <>
        <main className="min-h-screen bg-[#F3F8FC]" />
        <Modal
          open
          title="로그인이 필요합니다"
          description={
            "AI 일정 추천은 로그인 후 이용할 수 있어요.\n로그인 후 다시 시도해 주세요."
          }
          confirmText="로그인하기"
          cancelText="메인으로"
          onConfirm={() => router.push(loginHref)}
          onCancel={() => router.push("/")}
        />
      </>
    );
  }

  return <>{children}</>;
}
