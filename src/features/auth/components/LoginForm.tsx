"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/features/services/auth.service";
import { useLoginLockTimer } from "../hooks/useLoginLockTimer";
import { useSocialUrls } from "../hooks/useSocialUrl";
import { getErrorCode, getErrorNumber } from "../utils/authError";
import { formatCountdown } from "../utils/formatCountdown";

export default function LoginForm() {
  const router = useRouter();
  const { lockRemainingSeconds, setLockRemainingSeconds, clearLockTimer } = useLoginLockTimer();
  const { socialLoginUrls } = useSocialUrls();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameMessage = !username.trim() ? "아이디를 입력해주세요." : "";
    const passwordMessage = !password.trim() ? "비밀번호를 입력해주세요." : "";

    setUsernameError(usernameMessage);
    setPasswordError(passwordMessage);

    if (usernameMessage || passwordMessage) return;

    try {
      setIsLoading(true);

      // login servicd 함수 호출
      const data = await login({
        username: username.trim(),
        password,
      });

      window.dispatchEvent(new Event("auth-state-changed"));
      // 로그인 상태 변경되었으니 정보 다시 조회

      const normalizedUsername = username.trim();
      const pendingPasswordResetUsername = sessionStorage.getItem(
        "pendingPasswordResetUsername"
      );
      const shouldChangePassword =
        data?.requiresPasswordChange ||
        pendingPasswordResetUsername === normalizedUsername;

      if (shouldChangePassword) {
        router.push("/auth/login/newpw");
        return;
      }
      router.push("/");
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === "USER_006") {
        const failCount = getErrorNumber(error, "failCount");
        const maxAttempts = getErrorNumber(error, "maxAttempts", 5);
        const message =
          failCount > 0
            ? `아이디 또는 비밀번호가 틀렸습니다. (${failCount}/${maxAttempts}회 오류)`
            : "아이디 또는 비밀번호가 틀렸습니다.";

        setUsernameError("");
        setPasswordError(message);
        return;
      }

      if (errorCode === "USER_008") {
        const remainingSeconds = getErrorNumber(error, "remainingSeconds");

        setLockRemainingSeconds(remainingSeconds);
        setUsernameError("");
        setPasswordError("비밀번호 오류 횟수 초과로 계정이 잠겼습니다.");
        return;
      }

      if (errorCode === "USER_001") {
        setUsernameError("존재하지 않는 아이디입니다.");
        setPasswordError("");
        return;
      }

      if (errorCode === "USER_007") {
        setUsernameError("탈퇴한 계정입니다.");
        setPasswordError("");
        return;
      }

      setUsernameError("아이디 또는 비밀번호가 틀렸습니다.");
      setPasswordError("아이디 또는 비밀번호가 틀렸습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {lockRemainingSeconds > 0 && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/35 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-[18px] border border-[#DDE8EF] bg-white p-7 text-center shadow-[0_18px_42px_rgba(15,23,42,0.18)]"
          >
            <h2 className="text-[22px] font-bold text-[#111827]">
              계정이 잠겼습니다
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-[#667085]">
              비밀번호 오류 횟수 초과로 5분간 로그인이 제한됩니다.
            </p>
            <p className="mt-5 rounded-[14px] bg-[#F3F8FC] px-4 py-3 text-[18px] font-bold text-[#439A97]">
              {formatCountdown(lockRemainingSeconds)} 후 다시 시도해주세요
            </p>
            <button
              type="button"
              onClick={clearLockTimer}
              className="mt-6 h-11 w-full cursor-pointer rounded-[12px] bg-[#439A97] text-[15px] font-bold text-white transition hover:bg-[#367c79]"
            >
              확인
            </button>
          </div>
        </div>
      )}

    {/* 로그인폼 */}
      <div className="w-[400px]">
        <h1 className="text-[32px] font-bold text-[#111827]">로그인</h1>
        <p className="mt-2 text-[15px] text-[#98A2B3]">계정에 로그인하세요</p>

        <form className="mt-5" onSubmit={handleLogin}>
          {/* 아이디 입력 */}
          <div className="relative">
            <label className="text-[16px] font-semibold text-[#111827]">아이디</label>
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
              className={`mt-3 h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 text-[15px] outline-none ${
                usernameError ? "border border-[#DC2626]" : "border border-[#D0D5DD]"
              }`}
            />
            {usernameError && <p className="absolute mt-1 text-[13px] text-[#DC2626]">{usernameError}</p>}
          </div>

          {/* 비밀번호 입력 */}
          <div className="relative mt-8">
            <label className="text-[16px] font-semibold text-[#111827]">비밀번호</label>
            <div className="relative mt-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  validatePassword(value);
                }}
                disabled={isLoading}
                placeholder="비밀번호를 입력해주세요"
                className={`h-[56px] w-full rounded-[16px] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none ${
                  passwordError ? "border border-[#DC2626]" : "border border-[#D0D5DD]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <img src="/images/eye.svg" alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"} className="h-5 w-5" />
              </button>
            </div>
            {passwordError && <p className="absolute mt-1 text-[13px] text-[#DC2626]">{passwordError}</p>}
          </div>

          {/* 하단 링크 */}
          <div className="mt-8 flex items-center justify-between">
            <label className="flex items-center gap-2 text-[14px] text-[#344054]">
              <input type="checkbox" /> 로그인 상태 유지
            </label>
            <div className="flex items-center gap-2 text-[14px] text-[#6B9D9B]">
              <Link href="/auth/login/findid">아이디 찾기</Link>
              <span>|</span>
              <Link href="/auth/login/findpw">비밀번호 찾기</Link>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
              type="submit"
              disabled={isLoading}
              className={`mt-6 h-[56px] w-full rounded-[16px] text-[18px] font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? "cursor-not-allowed bg-[#D0D5DD]"
                  : "cursor-pointer bg-[#439A97] hover:bg-[#367c79] hover:shadow-lg hover:shadow-[#439A97]/30 active:bg-[#2f6f6d]"
              }`}
            >
              {isLoading ? "로그인 중..." : "로그인"}
          </button>

          <div className="mt-4 text-center text-[14px] text-[#98A2B3]">
            계정이 없으신가요?{" "}
            <Link href="/auth/register" className="font-semibold text-[#6D9D9B]">회원가입</Link>
          </div>

          {/* 소셜 로그인 */}
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E4E7EC]" />
            <span className="text-[12px] text-[#98A2B3]">또는 소셜 로그인</span>
            <div className="h-px flex-1 bg-[#E4E7EC]" />
          </div>

          {socialLoginUrls ? (
            <>
              <a
                href={socialLoginUrls.kakao}
                className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#FEE500] text-[17px] font-semibold text-black"
              >
                카카오로 계속하기
              </a>
              <a
                href={socialLoginUrls.google}
                className="mt-4 flex h-[56px] w-full items-center justify-center rounded-[16px] border border-[#D0D5DD] bg-[#F2F4F7] text-[17px] font-semibold text-[#344054]"
              >
                구글로 계속하기
              </a>
            </>
          ) : (
            <p className="mt-5 text-center text-[13px] text-[#DC2626]">
              소셜 로그인 설정이 필요합니다.
            </p>
          )}

          <Link
            href="/"
            className="mt-4 block w-full text-center text-[14px] text-[#98A2B3]"
          >
            메인으로 돌아가기
          </Link>
        </form>
      </div>
    </>
  );
}
