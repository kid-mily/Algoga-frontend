"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

export default function AdminLoginForm() {

  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // 에러 상태
  const [emailError, setEmailError] =
    useState("");

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  // 이메일 검증
  const validateEmail = (
    value: string
  ) => {

    return value.includes("@");
  };

  // 비밀번호 검증
  const validatePassword = (
    value: string
  ) => {

    const regex =
      /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    return regex.test(value);
  };

  // 로그인
  const handleLogin = () => {

    let hasError = false;

    // 이메일 체크
    if (
      !validateEmail(email)
    ) {

      setEmailError(
        "아이디를 다시 확인해주세요"
      );

      hasError = true;

    } else {

      setEmailError("");
    }

    // 비밀번호 체크
    if (
      !validatePassword(password)
    ) {

      setPasswordError(
        "비밀번호를 다시 확인해주세요"
      );

      hasError = true;

    } else {

      setPasswordError("");
    }

    // 에러 없으면 이동
    if (!hasError) {

      router.push(
        "/contentadmin/lecture"
      );
    }
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

        onSubmit={(e) => {
          e.preventDefault();

          handleLogin();
        }}
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
              setEmail(
                e.target.value
              );
              if (emailError) {
                setEmailError("");
              }
            }}

            placeholder="아이디를 입력해주세요 (travel@algoga.kr)"

            className={`mt-3 h-[56px] w-full rounded-[16px] border bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3] ${
              emailError
                ? "border-[#EF4444]"
                : "border-[#D0D5DD]"
            }`}
          />

          {/* 이메일 에러 */}
          {emailError && (

            <p className="mt-2 text-[14px] font-medium text-[#EF4444]">

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
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              value={password}

              onChange={(e) => {

                setPassword(
                  e.target.value
                );

                if (
                  passwordError
                ) {

                  setPasswordError(
                    ""
                  );
                }
              }}

              placeholder="비밀번호를 입력해주세요 (password)"

              className={`h-[56px] w-full rounded-[16px] border bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] ${
                passwordError
                  ? "border-[#EF4444]"
                  : "border-[#D0D5DD]"
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
                alt="눈아이콘"
                className="h-[18px] w-[18px]"
              />
            </button>
          </div>

          {/* 비밀번호 에러 */}
          {passwordError && (

            <p className="mt-2 text-[14px] font-medium text-[#EF4444]">

              비밀번호는 특수문자 포함 8자리 이상이어야 합니다
            </p>
          )}
        </div>

        {/* 로그인 유지 */}
        <div className="mt-5 flex items-center">

          <label className="flex items-center gap-2 text-[14px] text-[#344054]">

            <input type="checkbox" />

            로그인 상태 유지
          </label>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"

          className="mt-6 h-[56px] w-full rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition hover:bg-[#367c79]"
        >
          로그인
        </button>
      </form>
    </div>
  );
}