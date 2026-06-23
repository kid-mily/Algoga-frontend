"use client";

import Image from "next/image";
import { useState } from "react";
import { markAdminSessionActive } from "@/features/admin/auth/adminSession";
import {
  adminLogin,
  getAdminLoginRole,
  getAdminRedirectPathByRole,
} from "@/features/services/adminAuth.service";

const ADMIN_PATH_PREFIXES = [
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

const getSafeNextPath = () => {
  const rawNext = new URLSearchParams(window.location.search).get("next");

  if (!rawNext) return null;

  try {
    const nextUrl = new URL(rawNext, window.location.origin);
    const isInternal = nextUrl.origin === window.location.origin;
    const isAdminPath = ADMIN_PATH_PREFIXES.some(
      (path) => nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
    );

    if (!isInternal || !isAdminPath) return null;

    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  } catch {
    return null;
  }
};
export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdError, setLoginIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedLoginId = loginId.trim();
    let hasError = false;

    setServerError("");

    if (!trimmedLoginId) {
      setLoginIdError("관리자 아이디를 입력해주세요.");
      hasError = true;
    } else {
      setLoginIdError("");
    }

    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      setIsLoading(true);

      const admin = await adminLogin({
        loginId: trimmedLoginId,
        password,
      });
      const role = getAdminLoginRole(admin);

      if (!role) {
        throw new Error("관리자 역할 정보를 받지 못했습니다.");
      }

      markAdminSessionActive(role);
      window.dispatchEvent(new Event("auth-state-changed"));
      window.location.replace(
        getSafeNextPath() ?? getAdminRedirectPathByRole(role)
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "관리자 로그인에 실패했습니다.";

      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[400px]">
      <h1 className="text-[32px] font-bold text-[#111827]">
        관리자 로그인
      </h1>
      <p className="mt-2 text-[15px] text-[#98A2B3]">
        매니저 계정에 로그인하세요
      </p>
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            아이디
          </label>

          <input
            type="text"
            value={loginId}
            disabled={isLoading}
            onChange={(e) => {
              setLoginId(e.target.value);

              if (loginIdError) {
                setLoginIdError("");
              }

              if (serverError) {
                setServerError("");
              }
            }}
            placeholder="아이디를 입력해주세요"
            autoComplete="username"
            className={`mt-3 h-[56px] w-full rounded-[16px] border bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6] ${
              loginIdError ? "border-[#EF4444]" : "border-[#D0D5DD]"
            }`}
          />

          {loginIdError && (
            <p className="mt-2 text-[14px] font-medium text-[#EF4444]">
              {loginIdError}
            </p>
          )}
        </div>

        <div className="mt-6">
          <label className="text-[16px] font-semibold text-[#111827]">
            비밀번호
          </label>

          <div className="relative mt-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value);

                if (passwordError) {
                  setPasswordError("");
                }

                if (serverError) {
                  setServerError("");
                }
              }}
              placeholder="비밀번호를 입력해주세요"
              autoComplete="current-password"
              className={`h-[56px] w-full rounded-[16px] border bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6] ${
                passwordError ? "border-[#EF4444]" : "border-[#D0D5DD]"
              }`}
            />

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              aria-pressed={showPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed"
            >
              <Image
                src="/images/eye.svg"
                alt=""
                aria-hidden="true"
                width={18}
                height={18}
              />
            </button>
          </div>

          {passwordError && (
            <p className="mt-2 text-[14px] font-medium text-[#EF4444]">
              {passwordError}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center">
          <label className="flex items-center gap-2 text-[14px] text-[#344054]">
            <input type="checkbox" disabled={isLoading} />
            로그인 상태 유지
          </label>
        </div>

        {serverError && (
          <p className="mt-4 text-[14px] font-medium text-[#EF4444]" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 h-[56px] w-full rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition hover:bg-[#367c79] disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
