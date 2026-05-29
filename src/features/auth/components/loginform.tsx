// src/features/auth/components/loginform.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/features/services/auth.service";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (value: string) => {
    if (!value.trim()) {
      setUsernameError("아이디를 입력해주세요.");
      return "아이디를 입력해주세요.";
    }

    setUsernameError("");
    return "";
  };

  const validatePassword = (value: string) => {
  if (!value.trim()) {
    setPasswordError("비밀번호를 입력해주세요.");
  } else {
    setPasswordError("");
  }
};

  const isValid =
    username.trim() !== "" &&
    password.trim() !== "" &&
    !usernameError &&
    !passwordError;

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const usernameMessage = !username.trim() ? "아이디를 입력해주세요." : "";
  const passwordMessage = !password.trim() ? "비밀번호를 입력해주세요." : "";

  setUsernameError(usernameMessage);
  setPasswordError(passwordMessage);

  if (usernameMessage || passwordMessage) {
    return;
  }

  try {
    setIsLoading(true);

    const data = await login({
      username: username.trim(),
      password,
    });

    if (!data?.accessToken) {
      throw new Error("서버로부터 로그인 토큰을 받지 못했습니다.");
    }

    localStorage.setItem("accessToken", data.accessToken);

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    if (data.requiresPasswordChange) {
      router.push("/auth/login/newpw");
      return;
    }

    router.push("/");
  } catch (error: any) {
    console.error("로그인 에러:", error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="w-[400px]">
      <h1 className="text-[32px] font-bold text-[#111827]">로그인</h1>

      <p className="mt-2 text-[15px] text-[#98A2B3]">
        계정에 로그인하세요
      </p>

      <form className="mt-5" onSubmit={handleLogin}>
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
            className={`mt-3 h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6] ${
              usernameError
                ? "border border-[#DC2626]"
                : "border border-[#D0D5DD]"
            }`}
          />

          {usernameError && (
            <p className="absolute mt-1 text-[13px] text-[#DC2626]">
              {usernameError}
            </p>
          )}
        </div>

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
              className={`h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6] ${
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

          {passwordError && (
            <p className="absolute mt-1 text-[13px] text-[#DC2626]">
              {passwordError}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <label className="flex items-center gap-2 text-[14px] text-[#344054]">
            <input type="checkbox" />
            로그인 상태 유지
          </label>

          <div className="flex items-center gap-2 text-[14px] text-[#6B9D9B]">
            <Link href="/auth/login/findid">아이디 찾기</Link>
            <span>|</span>
            <Link href="/auth/login/findpw">비밀번호 찾기</Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`mt-6 h-[56px] w-full rounded-[16px] text-[18px] font-semibold text-white transition ${
            isValid && !isLoading
              ? "bg-[#439A97] hover:bg-[#367c79]"
              : "bg-[#D0D5DD] cursor-not-allowed"
          }`}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E4E7EC]" />
          <span className="text-[12px] text-[#98A2B3]">또는 소셜 로그인</span>
          <div className="h-px flex-1 bg-[#E4E7EC]" />
        </div>

        <button
          type="button"
          className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#FEE500] text-[17px] font-semibold text-black"
        >
          카카오로 계속하기
        </button>

        <button
          type="button"
          className="mt-4 flex h-[56px] w-full items-center justify-center rounded-[16px] border border-[#D0D5DD] bg-[#F2F4F7] text-[17px] font-semibold text-[#344054]"
        >
          구글로 계속하기
        </button>

        <div className="mt-8 text-center text-[14px] text-[#98A2B3]">
          계정이 없으신가요?{" "}
          <Link href="/auth/register" className="font-semibold text-[#6D9D9B]">
            회원가입
          </Link>
        </div>

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