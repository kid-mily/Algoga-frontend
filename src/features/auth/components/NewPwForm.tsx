"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/features/services/auth.service";
import CompleteModal from "@/features/common/CompleteModal"; // 🌟 모달 임포트 (경로 확인 필요)

export default function NewPwForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // 🌟 모달 상태 관리 (redirect 경로를 추가해 확인 버튼 클릭 시 이동 처리)
  const [modal, setModal] = useState({
    open: false,
    title: "",
    description: "",
    redirect: "",
  });

  const getPasswordError = (value: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!value.trim()) {
      return "비밀번호를 입력해주세요.";
    }

    if (!passwordRegex.test(value)) {
      return "영문 + 숫자 포함 8자 이상 입력해주세요.";
    }

    return "";
  };

  const getConfirmPasswordError = (
    value: string,
    currentPassword: string
  ) => {
    if (!value.trim()) {
      return "비밀번호를 다시 입력해주세요.";
    }

    if (currentPassword !== value) {
      return "비밀번호가 일치하지 않습니다.";
    }

    return "";
  };

  const validatePassword = (value: string) => {
    const message = getPasswordError(value);
    setPasswordError(message);
    return message;
  };

  const validateConfirmPassword = (
    value: string,
    currentPassword = password
  ) => {
    const message = getConfirmPasswordError(value, currentPassword);
    setConfirmPasswordError(message);
    return message;
  };

  const isValid =
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    !passwordError &&
    !confirmPasswordError;

  const handleComplete = async () => {
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    if (!password.trim() || !confirmPassword.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // 🌟 alert 대체
      setModal({
        open: true,
        title: "알림",
        description: "로그인 정보가 없습니다. 임시 비밀번호로 다시 로그인해주세요.",
        redirect: "/auth/login",
      });
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword({
        newPassword: password,
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // 🌟 alert 대체 (성공 시)
      setModal({
        open: true,
        title: "변경 완료",
        description: "비밀번호가 변경되었습니다. 새 비밀번호로 다시 로그인해주세요.",
        redirect: "/auth/login",
      });
    } catch (error: any) {
      // 🌟 alert 대체 (에러 시 - 페이지 이동 없음)
      setModal({
        open: true,
        title: "오류",
        description: error.message || "비밀번호 변경 중 오류가 발생했습니다.",
        redirect: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-[400px]">
        <h1 className="text-[32px] font-bold text-[#111827]">
          새 비밀번호 설정
        </h1>

        <p className="mt-2 text-[15px] text-[#98A2B3]">
          안전한 새 비밀번호를 설정해주세요
        </p>

        <div className="mt-8">
          <label className="text-[16px] font-semibold text-[#111827]">
            새 비밀번호
          </label>

          <div className="relative mt-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                validatePassword(value);

                if (confirmPassword) {
                  validateConfirmPassword(confirmPassword, value);
                }
              }}
              placeholder="비밀번호를 입력해주세요"
              className={`h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6] ${
                passwordError
                  ? "border border-[#DC2626]"
                  : "border border-[#D0D5DD]"
              }`}
            />

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed"
            >
              <img
                src="/images/eye.svg"
                alt="보기"
                className="h-[22px] w-[22px]"
              />
            </button>
          </div>

          <div className="mt-2 h-[20px]">
            {passwordError && (
              <p className="text-[13px] text-[#DC2626]">{passwordError}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="text-[16px] font-semibold text-[#111827]">
            비밀번호 확인
          </label>

          <div className="relative mt-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              disabled={isLoading}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword(value);
                validateConfirmPassword(value, password);
              }}
              placeholder="비밀번호를 다시 입력해주세요"
              className={`h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6] ${
                confirmPasswordError
                  ? "border border-[#DC2626]"
                  : "border border-[#D0D5DD]"
              }`}
            />

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed"
            >
              <img
                src="/images/eye.svg"
                alt="보기"
                className="h-[22px] w-[22px]"
              />
            </button>
          </div>

          <div className="mt-2 h-[20px]">
            {confirmPasswordError && (
              <p className="text-[13px] text-[#DC2626]">
                {confirmPasswordError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-[20px] bg-[#F9FAFB] p-5">
          <h2 className="text-[18px] font-bold text-[#111827]">
            비밀번호 조건
          </h2>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/images/check-circle.svg"
                alt="체크"
                className="h-[20px] w-[20px]"
              />
              <p className="text-[15px] text-[#98A2B3]">최소 8자 이상</p>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/images/check-circle.svg"
                alt="체크"
                className="h-[20px] w-[20px]"
              />
              <p className="text-[15px] text-[#98A2B3]">영문, 숫자 포함</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={!isValid || isLoading}
          className={`mt-8 h-[56px] w-full rounded-[16px] text-[18px] font-semibold text-white transition ${
            isValid && !isLoading
              ? "bg-[#439A97] hover:bg-[#367c79]"
              : "bg-[#CFE5E4] cursor-not-allowed"
          }`}
        >
          {isLoading ? "변경 중..." : "비밀번호 변경 완료"}
        </button>
      </div>

      {/* 🌟 모달 렌더링 영역 */}
      <CompleteModal
        open={modal.open}
        title={modal.title}
        description={modal.description}
        buttonText="확인"
        onConfirm={() => {
          // 1. 모달 닫기
          setModal((prev) => ({ ...prev, open: false }));
          
          // 2. 만약 redirect 경로가 지정되어 있다면 페이지 이동
          if (modal.redirect) {
            router.push(modal.redirect);
          }
        }}
      />
    </>
  );
}