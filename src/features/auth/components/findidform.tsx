"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FindHeader from "@/features/auth/components/FindHeader";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FindIdForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 🌟 에러 메시지 관리 상태 추가
  const [errorMessage, setErrorMessage] = useState("");

  const handleFindId = async () => {
    // 🌟 1. 입력 검사 로직 변경: alert 대신 에러 메시지 상태 업데이트
    if (!name || !email) {
      setErrorMessage("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(""); // 요청 시작 시 기존 에러 초기화

      const response = await fetch(`${BASE_URL}/api/v1/auth/find-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "일치하는 회원 정보가 없습니다.");
      }

      const maskedId = result.data.maskedId;
      sessionStorage.setItem("foundUserId", maskedId);
      router.push("/auth/login/findidcomplete");

    } catch (error: any) {
      // 🌟 2. 에러 발생 시 빨간색 글자 출력
      setErrorMessage(error.message || "아이디 찾기에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[440px]">
      <FindHeader
        backText="로그인으로 돌아가기"
        title="아이디 찾기"
        description="가입 시 등록한 정보를 입력해주세요"
      />

      <form className="mt-8">
        {/* 이름 */}
        <div>
          <label className="text-[18px] font-semibold text-[#111827]">이름</label>
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => {
                setName(e.target.value);
                setErrorMessage(""); // 입력 시 에러 초기화
            }}
            disabled={isLoading}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 이메일 */}
        <div className="mt-5">
          <label className="text-[18px] font-semibold text-[#111827]">이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(""); // 입력 시 에러 초기화
            }}
            disabled={isLoading}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 🌟 3. 에러 메시지 출력 영역 */}
        {errorMessage && (
            <p className="mt-4 text-[14px] font-medium text-[#DC2626] text-center">
                {errorMessage}
            </p>
        )}

        {/* 버튼 */}
        <button
          type="button"
          onClick={handleFindId}
          disabled={isLoading}
          className="mt-8 h-[45px] w-full rounded-[20px] bg-[#439A97] text-[20px] font-semibold text-white"
        >
          {isLoading ? "찾는 중..." : "아이디 찾기"}
        </button>
      </form>
    </div>
  );
}