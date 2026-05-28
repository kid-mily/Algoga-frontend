// src/features/auth/components/findpwcomplete.tsx

"use client";

import Link from "next/link";

export default function FindPwComplete() {
  return (
    <div className="flex w-[400px] flex-col items-center">
      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#439A97]">
        <img src="/images/mail.svg" alt="메일" className="h-[40px] w-[40px]" />
      </div>

      <h1 className="mt-6 text-[32px] font-bold text-[#111827]">
        이메일 전송 완료
      </h1>

      <p className="mt-2 text-[15px] text-[#98A2B3]">
        임시 비밀번호가 이메일로 전송되었습니다
      </p>

      <div className="mt-8 w-full rounded-[20px] border border-[#D8E1F0] bg-[#F3F6FC] px-6 py-6">
        <p className="text-[15px] leading-[1.8] text-[#667085]">
          가입한 이메일로 임시 비밀번호를 전송했습니다.
        </p>

        <p className="mt-6 text-[15px] leading-[1.8] text-[#667085]">
          이메일에서 임시 비밀번호를 확인한 뒤, 로그인 화면에서 임시
          비밀번호로 로그인해주세요.
        </p>

        <p className="mt-6 text-[15px] leading-[1.8] text-[#667085]">
          임시 비밀번호로 로그인하면 새 비밀번호 설정 화면으로 자동
          이동합니다.
        </p>
      </div>

      <div className="mt-6 flex w-full items-center rounded-[16px] border border-[#E6C75A] bg-[#FFFBEF] px-5 py-4">
        <span className="text-[14px] leading-[1.6] text-[#B08B1A]">
          이메일이 도착하지 않았다면 스팸 메일함을 확인해주세요.
        </span>
      </div>

      <Link
        href="/auth/login"
        className="mt-8 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition hover:bg-[#367c79]"
      >
        로그인하러 가기
      </Link>
    </div>
  );
}