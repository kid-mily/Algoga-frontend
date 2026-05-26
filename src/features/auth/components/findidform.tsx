"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FindHeader from "@/features/auth/components/findheader";

export default function FindIdForm() {
  const router = useRouter();

  // 입력값 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 아이디 찾기 버튼 클릭
  const handleFindId = () => {
    // 입력 검사
    if (!name || !email) {
      alert("이름과 이메일을 입력해주세요."); // 나중에 모달이나 다른걸로 변경 임시 alert
      return;
    }

    // 나중에 axios 성공 시 여기서 이동 그 !response 써서 검사...하기
    router.push("/auth/login/findidcomplete");
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
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 버튼 */}
        <button
          type="button"
          onClick={handleFindId}
          className="mt-8 h-[45px] w-full rounded-[20px] bg-[#439A97] text-[20px] font-semibold text-white"
        >
          아이디 찾기
        </button>
      </form>
    </div>
  );
}