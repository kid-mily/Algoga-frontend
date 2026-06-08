"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FindHeader from "@/features/auth/components/FindHeader";
// 🌟 1. 이미 만들어둔 auth.service.ts에서 findId 함수를 불러옵니다!
import { findId } from "@/features/services/auth.service"; 

export default function FindIdForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFindId = async () => {
    if (!name || !email) {
      setErrorMessage("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      // 🌟 2. fetch 대신 auth.service.ts의 findId 함수 사용!
      // (내부적으로 Axios를 사용하며 URL 꼬임 문제를 해결해 줍니다)
      const result = await findId({ name, email });

      // 🌟 3. 백엔드 개발자분 말씀대로 응답 구조에 맞게 데이터 추출
      // 백엔드 응답: { status: 200, data: { maskedId: "alg***" }, message: "..." }
      // result는 response.data 이므로, 실제 값은 result.data.maskedId 에 있습니다.
      const maskedId = result?.data?.maskedId || result?.maskedId;

      if (!maskedId) {
        throw new Error("아이디 정보를 찾을 수 없습니다.");
      }

      sessionStorage.setItem("foundUserId", maskedId);
      router.push("/auth/login/findidcomplete");

    } catch (error: any) {
      // Axios 에러는 auth.service.ts에서 깔끔하게 메시지로 던져주므로 바로 출력하면 됩니다.
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
                setErrorMessage(""); 
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
                setErrorMessage(""); 
            }}
            disabled={isLoading}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 에러 메시지 출력 영역 */}
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