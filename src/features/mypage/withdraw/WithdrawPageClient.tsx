"use client";

import { useState } from "react";
import Link from "next/link";
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
  "탈퇴 즉시 로그아웃되며, 탈퇴일로부터 30일 동안 동일한 이메일로 다시 가입할 수 없습니다.",
  "쿠폰, 마일리지, 친구, 채팅, 캘린더, 알림, 수료증, Q&A 정보는 탈퇴 즉시 삭제됩니다.",
  "게시글, 댓글, 결제, 예약, 환불, 문의, 챗봇 상담 내역, 강의 후기는 삭제되지 않고 보관됩니다.",
  "진행 중인 예약 또는 환불이 있으면 탈퇴할 수 없습니다. 해당 처리가 완료된 후 다시 시도해 주세요.",
];

// 백엔드 응답의 errorCode별 안내 문구
const WITHDRAW_ERROR_MESSAGE: Record<string, string> = {
  USER_010: "진행 중인 예약이 있습니다. 예약 이용이 완료되거나 취소된 후 다시 시도해 주세요.",
  USER_011: "진행 중인 환불이 있습니다. 환불 처리가 완료된 후 다시 시도해 주세요.",
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
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

  const hasInProgressCourses = summary.courseCount > 0;
  // USER_010(예약)/USER_011(환불)일 때만 예약 내역 페이지로 바로 갈 수 있는 CTA를 보여준다
  const showReservationCta = errorCode === "USER_010" || errorCode === "USER_011";

  const handleWithdrawClick = () => {
    setErrorMessage("");
    setErrorCode(undefined);
    setIsConfirmOpen(true);
  };

  // 탈퇴 확인 시 인증 모달을 바로 띄우지 않고 DELETE /me를 먼저 호출한다.
  // AUTH_014(이메일 미인증)일 때만 인증 모달을 띄우고, 그 외 에러(예약/환불 진행 중 등)는
  // 인증 모달 없이 바로 안내해 예약/환불 때문에 막힐 사용자가 인증 절차를 아예 안 겪게 한다.
  // USER_010/USER_011 등은 확인 팝업을 닫지 않고 그 안에서 바로 에러를 보여준다.
  const attemptWithdraw = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setErrorCode(undefined);

      await withdrawMyAccount();

      clearClientAuthState();
      window.dispatchEvent(
        new CustomEvent("auth-state-changed", {
          detail: { isLoggedIn: false },
        })
      );

      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);

      const code = getWithdrawErrorCode(error);

      if (code === "AUTH_014") {
        setIsConfirmOpen(false);
        setIsEmailAuthOpen(true);
        return;
      }

      if (code === "USER_007") {
        setIsConfirmOpen(false);
        setErrorMessage("이미 탈퇴한 계정입니다.");
        router.replace("/auth/login");
        return;
      }

      setErrorCode(code);
      setErrorMessage(getWithdrawErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmProceed = () => {
    void attemptWithdraw();
  };

  const handleEmailAuthSuccess = () => {
    setIsEmailAuthOpen(false);
    void attemptWithdraw();
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
              {user.nickname}님, 회원 탈퇴 전에 아래 내용을 확인해 주세요.
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
              <p className="mt-4 rounded-xl bg-[#FFF4D8] px-4 py-3 text-xs font-semibold leading-5 text-[#B7791F]">
                현재 수강 중인 강좌가 {summary.courseCount}개 있습니다. 탈퇴하면 해당 강좌의 학습 진행 내역이 모두 삭제되며 복구할 수 없습니다.
              </p>
            )}

            {errorMessage && !isConfirmOpen && (
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

      {/* 최종 확인 모달 */}
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
              정말 회원 탈퇴하시겠습니까?
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8A9BB0]">
              탈퇴하면 즉시 로그아웃되며, 이 작업은 되돌릴 수 없습니다.
            </p>

            {errorMessage && (
              <div className="mt-3 rounded-xl bg-red-50 px-3 py-2">
                <p className="break-words text-xs font-semibold text-red-500">
                  {errorMessage}
                </p>

                {showReservationCta && (
                  <Link
                    href="/mypage/reservations"
                    className="mt-1.5 inline-block text-xs font-bold text-red-600 underline underline-offset-2"
                  >
                    예약·환불 내역 확인하러 가기
                  </Link>
                )}
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                className="h-11 rounded-xl border border-[#E4EAF2] bg-white text-sm font-bold text-[#8A9BB0] hover:bg-[#F8FAFC] disabled:cursor-not-allowed"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleConfirmProceed}
                disabled={isSubmitting}
                className="h-11 rounded-xl bg-[#D95C5C] text-sm font-bold text-white hover:bg-[#BF4747] disabled:cursor-not-allowed disabled:bg-[#E9B4B4]"
              >
                {isSubmitting ? "확인 중..." : "회원 탈퇴"}
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
              탈퇴 후 30일 동안은 동일한 이메일로 다시 가입할 수 없습니다. 그동안 알고가와 함께해 주셔서 감사합니다.
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
