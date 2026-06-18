"use client";

import { useState } from "react";
import {
  MyPageApiError,
  verifyMyPassword,
} from "@/features/services/mypage.service";

interface PasswordVerifyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasswordVerifyModal({
  open,
  onClose,
  onSuccess,
}: PasswordVerifyModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setPassword("");
    setShowPassword(false);
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!password.trim()) {
      setErrorMessage("현재 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await verifyMyPassword({ password });

      setPassword("");
      setShowPassword(false);
      onSuccess();
    } catch (error) {
      console.error("비밀번호 확인 실패", error);

      if (error instanceof MyPageApiError) {

        console.error("비밀번호 확인 API 오류 상세", {
          status: error.status,
          code: error.code,
          traceId: error.traceId,
          responseData: error.responseData,
        });

        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "비밀번호 확인에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-verify-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="password-verify-title"
              className="text-lg font-bold text-[#0A1628]"
            >
              비밀번호 확인
            </h2>

            <p className="mt-1 text-xs font-medium text-[#8A9BB0]">
              정보 수정을 위해 비밀번호를 입력해 주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="닫기"
            className="shrink-0 text-xl leading-none text-[#8A9BB0] hover:text-[#0A1628] disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <label
          htmlFor="current-password"
          className="mt-5 block text-xs font-bold text-[#0A1628]"
        >
          현재 비밀번호
        </label>

        <div className="relative mt-2">
          <input
            id="current-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorMessage("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
            placeholder="비밀번호 입력"
            className="h-11 w-full rounded-xl border border-[#D9E2EC] px-4 pr-16 text-sm text-[#0A1628] outline-none focus:border-[#43A6A2] disabled:bg-[#F8FAFC]"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isSubmitting}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#43A6A2] disabled:cursor-not-allowed"
          >
            {showPassword ? "숨김" : "보기"}
          </button>
        </div>

        {errorMessage && (
          <p className="mt-3 break-words rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500">
            {errorMessage}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-11 rounded-xl border border-[#E4EAF2] bg-white text-sm font-bold text-[#8A9BB0] hover:bg-[#F8FAFC] disabled:cursor-not-allowed"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-[#43A6A2] text-sm font-bold text-white hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:bg-[#B7D8D6]"
          >
            {isSubmitting ? "확인 중..." : "확인"}
          </button>
        </div>
      </section>
    </div>
  );
}