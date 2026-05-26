"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FindHeader from "@/features/auth/components/findheader";
import Link from "next/link";

export default function FindIdForm() {
  const router = useRouter();

  // 입력값 state
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  // 임시 비밀번호 전송
  const handleFindPw = () => {
    // 입력 검사
    if (!userId || !email) {
      alert("아이디와 이메일을 입력해주세요.");
      return;
    }

    // 나중에 axios 성공 시 여기서 이동
    router.push("/auth/login/findpwcomplete");
  };

  return (
    <div className="w-[440px]">
      <FindHeader
        backText="로그인으로 돌아가기"
        title="비밀번호 찾기"
        description="아이디와 이메일을 입력해주세요"
      />

      <form className="mt-8">
        {/* 아이디 */}
        <div className="mt-5">
          <label className="text-[18px] font-semibold text-[#111827]">
            아이디
          </label>

          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
          onClick={handleFindPw}
          className="mt-8 h-[45px] w-full rounded-[20px] bg-[#439A97] text-[20px] font-semibold text-white"
        >
          임시비밀번호전송
        </button>

        {/* 아이디 찾기 */}
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