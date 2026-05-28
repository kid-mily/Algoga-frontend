"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPwForm() {

  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [
    confirmPasswordError,
    setConfirmPasswordError,
  ] = useState("");

  // 비밀번호 검증
  const validatePassword = (
    value: string
  ) => {

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!value.trim()) {

      setPasswordError(
        "비밀번호를 입력해주세요."
      );

      return;
    }

    if (!passwordRegex.test(value)) {

      setPasswordError(
        "영문 + 숫자 포함 8자 이상 입력해주세요."
      );

    } else {

      setPasswordError("");
    }
  };

  // 비밀번호 확인 검증
  const validateConfirmPassword = (
    value: string
  ) => {

    if (!value.trim()) {

      setConfirmPasswordError(
        "비밀번호를 다시 입력해주세요."
      );

      return;
    }

    if (password !== value) {

      setConfirmPasswordError(
        "비밀번호가 일치하지 않습니다."
      );

    } else {

      setConfirmPasswordError("");
    }
  };

  // 버튼 활성화
  const isValid =
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    !passwordError &&
    !confirmPasswordError;

  // 완료
  const handleComplete = () => {

    validatePassword(password);

    validateConfirmPassword(
      confirmPassword
    );

    if (!isValid) {
      return;
    }
    router.push("/auth/login");
  };

  return (
    <div className="w-[400px]">

      {/* 제목 */}
      <h1 className="text-[32px] font-bold text-[#111827]">
        새 비밀번호 설정
      </h1>

      <p className="mt-2 text-[15px] text-[#98A2B3]">
        안전한 새 비밀번호를 설정해주세요
      </p>

      {/* 새 비밀번호 */}
      <div className="mt-8">

        <label className="text-[16px] font-semibold text-[#111827]">
          새 비밀번호
        </label>

        <div className="relative mt-3">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }

            value={password}

            onChange={(e) => {

              const value =
                e.target.value;

              setPassword(value);

              validatePassword(
                value
              );
            }}

            placeholder="비밀번호를 입력해주세요"

            className={`h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] ${
              passwordError
                ? "border border-[#DC2626]"
                : "border border-[#D0D5DD]"
            }`}
          />

          {/* 보기 */}
          <button
            type="button"

            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }

            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <img
              src="/images/eye.svg"
              alt="보기"
              className="h-[22px] w-[22px]"
            />
          </button>
        </div>

        {/* 에러 */}
        <div className="mt-2 h-[20px]">

          {passwordError && (

            <p className="text-[13px] text-[#DC2626]">

              {passwordError}
            </p>
          )}
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="mt-6">

        <label className="text-[16px] font-semibold text-[#111827]">
          비밀번호 확인
        </label>

        <div className="relative mt-3">

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }

            value={confirmPassword}

            onChange={(e) => {

              const value =
                e.target.value;

              setConfirmPassword(
                value
              );

              validateConfirmPassword(
                value
              );
            }}

            placeholder="비밀번호를 다시 입력해주세요"

            className={`h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] ${
              confirmPasswordError
                ? "border border-[#DC2626]"
                : "border border-[#D0D5DD]"
            }`}
          />

          {/* 보기 */}
          <button
            type="button"

            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }

            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <img
              src="/images/eye.svg"
              alt="보기"
              className="h-[22px] w-[22px]"
            />
          </button>
        </div>

        {/* 에러 */}
        <div className="mt-2 h-[20px]">

          {confirmPasswordError && (

            <p className="text-[13px] text-[#DC2626]">

              {confirmPasswordError}
            </p>
          )}
        </div>
      </div>

      {/* 조건 박스 */}
      <div className="mt-8 rounded-[20px] bg-[#F9FAFB] p-5">

        <h2 className="text-[18px] font-bold text-[#111827]">
          비밀번호 조건
        </h2>

        <div className="mt-4 space-y-3">

          {/* 조건 1 */}
          <div className="flex items-center gap-3">

            <img
              src="/images/check-circle.svg"
              alt="체크"
              className="h-[20px] w-[20px]"
            />

            <p className="text-[15px] text-[#98A2B3]">
              최소 8자 이상
            </p>
          </div>

          {/* 조건 2 */}
          <div className="flex items-center gap-3">

            <img
              src="/images/check-circle.svg"
              alt="체크"
              className="h-[20px] w-[20px]"
            />

            <p className="text-[15px] text-[#98A2B3]">
              영문, 숫자 포함
            </p>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <button
        type="button"

        onClick={handleComplete}

        disabled={!isValid}

        className={`mt-8 h-[56px] w-full rounded-[16px] text-[18px] font-semibold text-white transition ${
          isValid
            ? "bg-[#439A97] hover:bg-[#367c79]"
            : "bg-[#CFE5E4]"
        }`}
      >
        비밀번호 변경 완료
      </button>
    </div>
  );
}