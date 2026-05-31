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

  const handleFindPw = async () => {
    if (!userId.trim() || !email.trim()) {
      alert("아이디와 이메일을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      await findPassword({
        username: userId.trim(),
        email: email.trim(),
      });

      router.push("/auth/login/findpwcomplete");
    } catch (error: any) {
      alert(error.message);
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
            onChange={(e) => setUserId(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-[45px] w-full rounded-[20px] border border-[#D0D5DD] bg-[#F9FAFB] px-6 text-[18px] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#EEF2F6]"
          />
        </div>

        <button
          type="button"
          onClick={handleFindPw}
          disabled={isLoading}
          className="mt-8 h-[45px] w-full rounded-[20px] bg-[#439A97] text-[20px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isLoading ? "전송 중..." : "임시비밀번호전송"}
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