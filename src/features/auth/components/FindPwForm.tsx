"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FindHeader from "@/features/auth/components/FindHeader";
import Link from "next/link";
import { findPassword } from "@/features/services/auth.service";

export default function FindPwForm() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 🌟 에러 메시지 상태 추가
  const [errorMessage, setErrorMessage] = useState("");

  const handleFindPw = async () => {
    // 🌟 입력 검사 시 alert 대신 에러 메시지 표시
    if (!userId.trim() || !email.trim()) {
      setErrorMessage("아이디와 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(""); // 요청 전 에러 초기화

      await findPassword({
        username: userId.trim(),
        email: email.trim(),
      });

      router.push("/auth/login/findpwcomplete");
    } catch (error: any) {
      // 🌟 에러 발생 시 빨간색 글자 출력
      setErrorMessage(error.message || "비밀번호 찾기에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[440px]">
      <FindHeader
        backText="로그인으로 돌아가기"
        title="비밀번호 찾기"
        description="아이디와 이메일을 입력해주세요"
      />

      <form className="mt-8">
        <div className="mt-5">
          <label className="text-[18px] font-semibold text-[#111827]">
            아이디
          </label>
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            value={userId}
            disabled={isLoading}
            onChange={(e) => {
                setUserId(e.target.value);
                setErrorMessage(""); // 입력 시 에러 초기화
            }}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6]"
          />
        </div>

        <div className="mt-5">
          <label className="text-[18px] font-semibold text-[#111827]">
            이메일
          </label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            disabled={isLoading}
            onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(""); // 입력 시 에러 초기화
            }}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6]"
          />
        </div>

        {/* 🌟 에러 메시지 출력 영역 */}
        {errorMessage && (
            <p className="mt-4 text-[14px] font-medium text-[#DC2626] text-center">
                {errorMessage}
            </p>
        )}

        <button
          type="button"
          onClick={handleFindPw}
          disabled={isLoading}
          className="mt-8 h-[45px] w-full rounded-[20px] bg-[#439A97] text-[20px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isLoading ? "전송 중..." : "임시 비밀번호 전송"}
        </button>

        <Link
          href="/auth/login/findid"
          className="mt-4 block text-center text-[#439A97]"
        >
          아이디가 기억나지 않으시나요?
        </Link>
      </form>
    </div>
  );
}