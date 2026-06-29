"use client";

import Image from "next/image";
import { useAdminLoginForm } from "@/features/admin/auth/hooks/useAdminLoginForm";

export default function AdminLoginForm() {
  const {
    showPassword,
    setShowPassword,
    loginId,
    password,
    loginIdError,
    passwordError,
    serverError,
    isLoading,
    handleLoginIdChange,
    handlePasswordChange,
    handleLogin,
  } = useAdminLoginForm();

  return (
    <div className="w-[400px]">
      <form
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
              handleLoginIdChange(e.target.value);
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
                handlePasswordChange(e.target.value);
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
