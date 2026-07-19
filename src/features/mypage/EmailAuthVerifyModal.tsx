"use client";

import { useState } from "react";
import {
  MyPageApiError,
  sendMyPageAuthCode,
  verifyMyPageAuthCode,
} from "@/features/services/mypage.service";

interface EmailAuthVerifyModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmailAuthVerifyModal({
  open,
  email,
  onClose,
  onSuccess,
}: EmailAuthVerifyModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) {
    return null;
  }

  const reset = () => {
    setIsSending(false);
    setIsVerifying(false);
    setIsCodeSent(false);
    setCode("");
    setMessage("");
    setErrorMessage("");
  };

  const handleClose = () => {
    if (isSending || isVerifying) return;
    reset();
    onClose();
  };

  const handleSendCode = async () => {
    try {
      setIsSending(true);
      setErrorMessage("");

      await sendMyPageAuthCode();

      setIsCodeSent(true);
      setCode("");
      setMessage("인증번호를 이메일로 보냈습니다. 인증번호는 발송 후 3분 이내로 입력해주세요.");
    } catch (error) {
      setMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "인증번호 발송에 실패했습니다."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMessage("인증번호를 입력해 주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage("");

      await verifyMyPageAuthCode({ email, code: code.trim() });

      reset();
      onSuccess();
    } catch (error) {
      if (error instanceof MyPageApiError) {
        console.error("이메일 인증 API 오류 상세", {
          status: error.status,
          code: error.code,
          traceId: error.traceId,
          responseData: error.responseData,
        });
      }

      setErrorMessage(
        error instanceof Error ? error.message : "인증번호 확인에 실패했습니다."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-auth-verify-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="email-auth-verify-title"
              className="text-lg font-bold text-[#0A1628]"
            >
              이메일 인증
            </h2>

            <p className="mt-1 text-xs font-medium text-[#8A9BB0]">
              정보 수정을 위해 {email}로 발송된 인증번호를 입력해 주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSending || isVerifying}
            aria-label="닫기"
            className="shrink-0 text-xl leading-none text-[#8A9BB0] hover:text-[#0A1628] disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <button
          type="button"
          onClick={handleSendCode}
          disabled={isSending}
          className="mt-5 h-11 w-full rounded-xl border border-[#43A6A2] text-sm font-bold text-[#43A6A2] hover:bg-[#EEF8F7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "발송 중..." : isCodeSent ? "인증번호 재발송" : "인증번호 발송"}
        </button>

        {message && (
          <p className="mt-2 text-xs font-semibold text-[#43A6A2]">{message}</p>
        )}

        {isCodeSent && (
          <>
            <label
              htmlFor="mypage-auth-code"
              className="mt-5 block text-xs font-bold text-[#0A1628]"
            >
              인증번호
            </label>

            <input
              id="mypage-auth-code"
              type="text"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setErrorMessage("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleVerify();
                }
              }}
              disabled={isVerifying}
              placeholder="인증번호 입력"
              className="mt-2 h-11 w-full rounded-xl border border-[#D9E2EC] px-4 text-sm text-[#0A1628] outline-none focus:border-[#43A6A2] disabled:bg-[#F8FAFC]"
            />
          </>
        )}

        {errorMessage && (
          <p className="mt-3 break-words rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500">
            {errorMessage}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSending || isVerifying}
            className="h-11 rounded-xl border border-[#E4EAF2] bg-white text-sm font-bold text-[#8A9BB0] hover:bg-[#F8FAFC] disabled:cursor-not-allowed"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleVerify}
            disabled={!isCodeSent || isVerifying}
            className="h-11 rounded-xl bg-[#43A6A2] text-sm font-bold text-white hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:bg-[#B7D8D6]"
          >
            {isVerifying ? "확인 중..." : "확인"}
          </button>
        </div>
      </section>
    </div>
  );
}
