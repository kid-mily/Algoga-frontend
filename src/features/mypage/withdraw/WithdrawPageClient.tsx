"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import EmailAuthVerifyModal from "@/features/mypage/EmailAuthVerifyModal";
import { withdrawMyAccount } from "@/features/services/mypage.service";
import type { MyPageSummary, MyPageUser } from "@/features/mypage/types";

interface WithdrawPageClientProps {
  user: MyPageUser;
  summary: MyPageSummary;
}

const POLICY_NOTES = [
  "탈퇴 즉시 로그아웃되며, 동일한 이메일로는 30일간 재가입할 수 없습니다.",
  "쿠폰, 마일리지, 친구, 채팅, 캘린더, 알림, 수료증, Q&A 정보는 탈퇴 즉시 삭제됩니다.",
  "게시글, 댓글, 결제, 예약, 환불, 문의, 챗봇 상담 내역, 강의 후기는 삭제되지 않고 그대로 보관됩니다.",
  "진행 중인 예약 또는 환불이 있으면 탈퇴할 수 없습니다. 취소·완료 후 다시 시도해 주세요.",
];

// 백엔드 응답의 errorCode별 안내 문구 (AUTH_014/USER_007은 별도 처리가 필요해 handleEmailAuthSuccess에서 분기)
const WITHDRAW_ERROR_MESSAGE: Record<string, string> = {
  USER_010: "진행 중인 예약이 있어 탈퇴할 수 없습니다.",
  USER_011: "진행 중인 환불이 있어 탈퇴할 수 없습니다.",
};

const getWithdrawErrorCode = (error: unknown): string | undefined => {
  if (!(error instanceof ApiRequestError)) return undefined;

  return (
    (error.body as { errorCode?: string } | null)?.errorCode || error.code
  );
};

const getWithdrawErrorMessage = (error: unknown): string => {
  const errorCode = getWithdrawErrorCode(error);

  if (errorCode && WITHDRAW_ERROR_MESSAGE[errorCode]) {
    return WITHDRAW_ERROR_MESSAGE[errorCode];
  }

  return error instanceof Error
    ? error.message
    : "회원 탈퇴 중 오류가 발생했습니다.";
};

// accessToken/refreshToken 쿠키는 서버가 응답 헤더로 자동 삭제 - 프론트는 로그인 상태(localStorage)만 초기화
const clearClientAuthState = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export default function WithdrawPageClient({
  user,
  summary,
}: WithdrawPageClientProps) {
  const router = useRouter();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEmailAuthOpen, setIsEmailAuthOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasInProgressCourses = summary.courseCount > 0;

  const handleWithdrawClick = () => {
    setErrorMessage("");
    setIsConfirmOpen(true);
  };

  const handleConfirmProceed = () => {
    setIsConfirmOpen(false);
    setIsEmailAuthOpen(true);
  };

  const handleEmailAuthSuccess = async () => {
    setIsEmailAuthOpen(false);

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await withdrawMyAccount();

      clearClientAuthState();
      window.dispatchEvent(
        new CustomEvent("auth-state-changed", {
          detail: { isLoggedIn: false },
        })
      );

      setIsSuccessOpen(true);
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);

      const errorCode = getWithdrawErrorCode(error);

      if (errorCode === "AUTH_014") {
        setErrorMessage("본인 인증을 다시 진행해주세요.");
        setIsEmailAuthOpen(true);
        return;
      }

      if (errorCode === "USER_007") {
        setErrorMessage("이미 탈퇴한 계정입니다.");
        router.replace("/auth/login");
        return;
      }

      setErrorMessage(getWithdrawErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessConfirm = () => {
    router.replace("/");
    router.refresh();
  };

  return (
    <>
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xl font-bold text-[#0A1628]"
          >
            <span aria-hidden="true">‹</span>
            회원 탈퇴
          </button>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-[#E5EDF5] px-6 py-5">
            <h2 className="text-sm font-bold text-[#0A1628]">
              탈퇴 전 꼭 확인해 주세요
            </h2>
            <p className="mt-1 text-xs text-[#8A9BB0]">
              {user.nickname || user.name}님, 탈퇴하시면 아래 내용이 적용됩니다.
            </p>
          </div>

          <div className="px-6 py-6">
            <ul className="space-y-2.5 text-sm leading-6 text-[#344054]">
              {POLICY_NOTES.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="text-[#43A6A2]">·</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            {hasInProgressCourses && (
              <p className="mt-4 rounded-xl bg-[#FDF3F3] px-4 py-3 text-xs font-semibold leading-5 text-[#B54747]">
                현재 수강 중인 강좌가 {summary.courseCount}개 있습니다. 탈퇴 시
                학습 진행 내역이 모두 사라지며 복구할 수 없습니다.
              </p>
            )}

            {errorMessage && (
              <p className="mt-4 break-words rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-500">
                {errorMessage}
              </p>
            )}
          </div>
        </section>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/mypage")}
            className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleWithdrawClick}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-[#D95C5C] text-sm font-bold text-white transition-colors hover:bg-[#BF4747] disabled:cursor-not-allowed disabled:bg-[#E9B4B4]"
          >
            {isSubmitting ? "처리 중..." : "탈퇴하기"}
          </button>
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-confirm-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="withdraw-confirm-title"
              className="text-lg font-bold text-[#0A1628]"
            >
              정말 탈퇴하시겠습니까?
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8A9BB0]">
              탈퇴 후에는 동일 이메일로 30일간 재가입할 수 없습니다. 게시글,
              댓글, 결제·예약 내역은 삭제되지 않고 그대로 남으며, 진행 중인
              예약이나 환불이 있으면 먼저 취소·완료해 주세요.
            </p>

            {hasInProgressCourses && (
              <p className="mt-3 rounded-xl bg-[#FDF3F3] px-3 py-2 text-xs font-semibold leading-5 text-[#B54747]">
                수강 중인 강좌 {summary.courseCount}개의 학습 진행 내역이 모두
                사라집니다.
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="h-11 rounded-xl border border-[#E4EAF2] bg-white text-sm font-bold text-[#8A9BB0] hover:bg-[#F8FAFC]"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleConfirmProceed}
                className="h-11 rounded-xl bg-[#D95C5C] text-sm font-bold text-white hover:bg-[#BF4747]"
              >
                본인 확인하기
              </button>
            </div>
          </section>
        </div>
      )}

      <EmailAuthVerifyModal
        open={isEmailAuthOpen}
        email={user.email}
        onClose={() => setIsEmailAuthOpen(false)}
        onSuccess={handleEmailAuthSuccess}
      />

      {isSuccessOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-success-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
          >
            <h2
              id="withdraw-success-title"
              className="text-lg font-bold text-[#0A1628]"
            >
              회원 탈퇴가 완료되었습니다.
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8A9BB0]">
              동일한 이메일로는 30일간 재가입할 수 없습니다. 그동안 알고가를
              이용해 주셔서 감사합니다.
            </p>

            <button
              type="button"
              onClick={handleSuccessConfirm}
              className="mt-6 h-11 w-full rounded-xl bg-[#43A6A2] text-sm font-bold text-white hover:bg-[#357F7C]"
            >
              메인으로 이동
            </button>
          </section>
        </div>
      )}
    </>
  );
}
