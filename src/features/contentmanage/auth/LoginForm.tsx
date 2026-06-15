"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogin } from "@/features/services/adminAuth.service";
import { getAdminRedirectPath } from "@/lib/adminToken";
import { deleteCookie, setCookie } from "@/lib/cookie";

export default function AdminLoginForm() {
  const router = useRouter();
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

      const data = await adminLogin({
        loginId: trimmedLoginId,
        password,
      });

      if (!data?.accessToken) {
        throw new Error("관리자 로그인 토큰을 받지 못했습니다.");
      }

      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      deleteCookie("adminAccessToken");
      deleteCookie("adminRefreshToken");

      setCookie("adminAccessToken", data.accessToken);

      if (data.refreshToken) {
        setCookie("adminRefreshToken", data.refreshToken);
      }

      router.push(getAdminRedirectPath(data.accessToken));
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
              className="absolute right-4 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed"
            >
              <img
                src="/images/eye.svg"
                alt="비밀번호 보기"
                className="h-[18px] w-[18px]"
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
