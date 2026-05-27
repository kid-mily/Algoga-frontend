"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  // 상태 관리 (이메일이 아닌 아이디)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // 아이디 검증
  const validateUsername = (value: string) => {
    if (!value.trim()) {
      setUsernameError("아이디를 입력해주세요.");
    } else {
      setUsernameError("");
    }
  };

  // 비밀번호 검증
  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!value.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
    } else if (!passwordRegex.test(value)) {
      setPasswordError("영문 + 숫자 포함 8자 이상 입력해주세요.");
    } else {
      setPasswordError("");
    }
  };

  // 버튼 활성화
  const isValid =
    username.trim() !== "" &&
    password.trim() !== "" &&
    !usernameError &&
    !passwordError;

  // 로그인 로직 및 터미널 콘솔 로그
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    validateUsername(username);
    validatePassword(password);

    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);

      console.log("📝 [Frontend] 로그인 버튼 클릭됨!");
      console.log("📡 전송 대상 API: POST http://localhost:15000/api/v1/auth/login");
      console.log("📦 전송 데이터 페이로드(Payload):", {
        username: username,
        password: password,
      });

      const response = await authApi.login({
        username,
        password,
      });

      console.log("✅ [Frontend] 로그인 성공! 서버 응답 데이터:", response);

      const { accessToken, refreshToken, requiresPasswordChange } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (requiresPasswordChange) {
        console.warn("⚠️ [Frontend] 임시 비밀번호 사용자입니다. 강제 변경 페이지로 이동합니다.");
        router.push("/auth/login/reset-password");
      } else {
        console.log("🚀 [Frontend] 메인 페이지로 이동합니다.");
        router.push("/");
      }
    } catch (error: any) {
      console.error("❌ [Frontend] 로그인 실패:", error.message);
      alert(error.message || "아이디 또는 비밀번호가 틀렸습니다.");
    } finally {
      setIsLoading(false);
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

      <form className="mt-5" onSubmit={handleLogin}>
       {/* 아이디 */}
<div className="relative">
  <label className="text-[16px] font-semibold text-[#111827]">
    아이디
  </label>

  <input
    type="text"
    value={username}
    onChange={(e) => {
      const value = e.target.value;
      setUsername(value);
      validateUsername(value);
    }}
    disabled={isLoading}
    placeholder="아이디를 입력해주세요"
    className={`mt-3 h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3] ${
      usernameError
        ? "border border-[#DC2626]"
        : "border border-[#D0D5DD]"
    }`}
  />

  {/* 에러 메시지 */}
  {usernameError && (
    <p className="absolute mt-1 text-[13px] text-[#DC2626]">
      {usernameError}
    </p>
  )}
</div>

{/* 비밀번호 */}
<div className="relative mt-8">
  <label className="text-[16px] font-semibold text-[#111827]">
    비밀번호
  </label>

  <div className="relative mt-3">
    <input
      type="password"
      value={password}
      onChange={(e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
      }}
      disabled={isLoading}
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
      <img src="/images/eye.svg" alt="눈아이콘" />
    </button>
  </div>

  {/* 에러 메시지 */}
  {passwordError && (
    <p className="absolute mt-1 text-[13px] text-[#DC2626]">
      {passwordError}
    </p>
  )}

        </div>

        {/* 옵션 */}
        <div className="mt-8 flex items-center justify-between">
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

        {/* 로그인 버튼 (원본 조건부 스타일링 복구) */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`mt-6 h-[56px] w-full rounded-[16px] text-[18px] font-semibold text-white transition ${
            isValid && !isLoading
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