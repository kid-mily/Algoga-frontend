"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FindHeader from "@/features/auth/components/findheader";

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  
export default function FindIdForm() {
  const router = useRouter();

  // 입력값 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // 로딩 상태 (중복 클릭 방지)
  const [isLoading, setIsLoading] = useState(false);


  // 아이디 찾기 버튼 클릭
  const handleFindId = async () => {
    // 입력 검사
    if (!name || !email) {
      alert("이름과 이메일을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      // 🌟 프론트엔드 터미널(콘솔) 로그 출력
      console.log("📝 [Frontend] 아이디 찾기 요청 시도");
      console.log("📡 전송 대상 API: POST https://kidmily.kro.kr/api/v1/auth/find-id");
      console.log("📦 전송 데이터 페이로드(Payload):", { name, email });

      // 백엔드 API 호출 (fetch 사용)
      const response = await fetch(`${BASE_URL}/api/v1/auth/find-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();
      console.log("✅ [Frontend] 아이디 찾기 서버 응답 데이터:", result);

      // !response.ok 검사 (실패 시 에러 처리)
      if (!response.ok) {
        throw new Error(result.message || "일치하는 회원 정보가 없습니다.");
      }

      // 성공 시 백엔드에서 준 마스킹된 아이디 추출
      const maskedId = result.data.maskedId;
      
      // 🌟 세션스토리지에 저장하여 완료 페이지에서 꺼내 쓸 수 있도록 처리
      sessionStorage.setItem("foundUserId", maskedId);

      // 완료 페이지로 이동
      router.push("/auth/login/findidcomplete");

    } catch (error: any) {
      console.error("❌ [Frontend] 아이디 찾기 실패:", error.message);
      alert(error.message);
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
          <label className="text-[18px] font-semibold text-[#111827]">
            이름
          </label>

          <input
            type="text"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 이메일 */}
        <div className="mt-5">
          <label className="text-[18px] font-semibold text-[#111827]">
            이메일
          </label>

          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

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