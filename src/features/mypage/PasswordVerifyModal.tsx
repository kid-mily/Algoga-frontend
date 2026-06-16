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

  if (!open) return null;

  const handleClose = () => {
    if (isSubmitting) return;

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

      await verifyMyPassword({
        password,
      });

      setPassword("");
      setShowPassword(false);
      onSuccess();
    } catch (error) {
      console.error("비밀번호 확인 실패:", error);

      if (error instanceof MyPageApiError) {
        setErrorMessage(
          error.traceId
            ? `${error.message} traceId: ${error.traceId}`
            : error.message
        );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-verify-title"
        className="w-[470px] overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-[#E8EEF5] px-6 py-5">
          <h2
            id="password-verify-title"
            className="text-xl font-bold text-[#0A1628]"
          >
            비밀번호 확인
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="닫기"
            className="text-2xl leading-none text-[#8A9BB0] transition hover:text-[#0A1628] disabled:cursor-not-allowed"
          >
            ×
          </button>
        </header>

        <div className="px-6 py-7">
          <p className="text-sm font-medium text-[#8A9BB0]">
            정보 수정을 위해 현재 비밀번호를 입력해 주세요.
          </p>

          <label
            htmlFor="current-password"
            className="mt-6 block text-sm font-semibold text-[#0A1628]"
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
              placeholder="비밀번호를 입력하세요"
              className="h-12 w-full rounded-2xl border border-[#D9E2EC] px-4 pr-12 text-sm outline-none transition focus:border-[#43A6A2] disabled:bg-[#F8FAFC]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8A9BB0] disabled:cursor-not-allowed"
            >
              {showPassword ? "숨김" : "보기"}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-3 text-sm font-semibold text-red-500">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-12 rounded-2xl border border-[#E4EAF2] text-sm font-bold text-[#8A9BB0] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 rounded-2xl bg-[#43A6A2] text-sm font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:bg-[#B7D8D6]"
            >
              {isSubmitting ? "확인 중..." : "확인"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}