"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useState } from "react";

export default function LoginForm() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  // 이메일 검증
  const validateEmail = (
    value: string
  ) => {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) {

      setEmailError(
        "이메일을 입력해주세요."
      );

      return;
    }

    if (!emailRegex.test(value)) {

      setEmailError(
        "올바른 이메일 형식을 입력해주세요."
      );

    } else {

      setEmailError("");
    }
  };

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

  // 버튼 활성화
  const isValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    !emailError &&
    !passwordError;

  // 로그인
  const handleLogin = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    validateEmail(email);

    validatePassword(password);

    if (!isValid) {
      return;
    }

    console.log("로그인");

    router.push("/");
  };

  return (
    <div className="w-[400px]">

      {/* 타이틀 */}
      <h1 className="text-[32px] font-bold text-[#111827]">
        로그인
      </h1>

      <p className="mt-2 text-[15px] text-[#98A2B3]">
        계정에 로그인하세요
      </p>

      <form
        className="mt-5"
        onSubmit={handleLogin}
      >

        {/* 아이디 */}
        <div>

          <label className="text-[16px] font-semibold text-[#111827]">
            아이디
          </label>

          <input
            type="email"

            value={email}

            onChange={(e) => {

              const value =
                e.target.value;

              setEmail(value);

              validateEmail(value);
            }}

            placeholder="아이디를 입력해주세요"

            className={`mt-3 h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3] ${
              emailError
                ? "border border-[#DC2626]"
                : "border border-[#D0D5DD]"
            }`}
          />

          {/* 에러 */}
          {emailError && (

            <p className="mt-2 text-[13px] text-[#DC2626]">

              {emailError}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mt-6">

          <label className="text-[16px] font-semibold text-[#111827]">
            비밀번호
          </label>

          <div className="relative mt-3">

            <input
              type="password"

              value={password}

              onChange={(e) => {

                const value =
                  e.target.value;

                setPassword(value);

                validatePassword(value);
              }}

              placeholder="비밀번호를 입력해주세요"

              className={`h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] ${
                passwordError
                  ? "border border-[#DC2626]"
                  : "border border-[#D0D5DD]"
              }`}
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px]"
            >
              <img
                src="/images/eye.svg"
                alt="눈아이콘"
              />
            </button>
          </div>

          {/* 에러 */}
          {passwordError && (

            <p className="mt-2 text-[13px] text-[#DC2626]">

              {passwordError}
            </p>
          )}
        </div>

        {/* 옵션 */}
        <div className="mt-5 flex items-center justify-between">

          <label className="flex items-center gap-2 text-[14px] text-[#344054]">

            <input type="checkbox" />

            로그인 상태 유지
          </label>

          <div className="flex items-center gap-2 text-[14px] text-[#6B9D9B]">

            <Link href="/auth/login/findid">
              아이디 찾기
            </Link>

            <span>|</span>

            <Link href="/auth/login/findpw">
              비밀번호 찾기
            </Link>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"

          disabled={!isValid}

          className={`mt-6 h-[56px] w-full rounded-[16px] text-[18px] font-semibold text-white transition ${
            isValid
              ? "bg-[#439A97] hover:bg-[#367c79]"
              : "bg-[#D0D5DD]"
          }`}
        >
          로그인
        </button>

        {/* 구분선 */}
        <div className="mt-5 flex items-center gap-3">

          <div className="h-px flex-1 bg-[#E4E7EC]" />

          <span className="text-[12px] text-[#98A2B3]">
            또는 소셜 로그인
          </span>

          <div className="h-px flex-1 bg-[#E4E7EC]" />
        </div>

        {/* 카카오 */}
        <button
          type="button"
          className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#FEE500] text-[17px] font-semibold text-black"
        >
          카카오로 계속하기
        </button>

        {/* 구글 */}
        <button
          type="button"
          className="mt-4 flex h-[56px] w-full items-center justify-center rounded-[16px] border border-[#D0D5DD] bg-[#F2F4F7] text-[17px] font-semibold text-[#344054]"
        >
          구글로 계속하기
        </button>

        {/* 회원가입 */}
        <div className="mt-8 text-center text-[14px] text-[#98A2B3]">

          계정이 없으신가요?{" "}

          <Link
            href="/auth/register"
            className="font-semibold text-[#6D9D9B]"
          >
            회원가입
          </Link>
        </div>

        {/* 메인 이동 */}
        <Link
          href="/"
          className="mt-4 block w-full text-center text-[14px] text-[#98A2B3]"
        >
          메인으로 돌아가기
        </Link>
      </form>
    </div>
  );
}