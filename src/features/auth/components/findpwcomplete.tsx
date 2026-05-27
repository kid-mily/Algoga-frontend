"use client";

import Link from "next/link";

export default function FindPwComplete() {

  return (
    <div className="flex w-[400px] flex-col items-center">


      {/* 아이콘 */}
      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#439A97]">
        <img
          src="/images/mail.svg"
          alt="메일"
          className="h-[40px] w-[40px]"
        />
      </div>

      {/* 타이틀 */}
      <h1 className="mt-6 text-[32px] font-bold text-[#111827]">
        이메일 전송 완료
      </h1>

      {/* 설명 */}
      <p className="mt-2 text-[15px] text-[#98A2B3]">
        임시 비밀번호가 이메일로 전송되었습니다
      </p>

      {/* 안내 박스 */}
      <div className="mt-8 w-full rounded-[20px] border border-[#D8E1F0] bg-[#F3F6FC] px-6 py-6">

        <p className="text-[15px] leading-[1.8] text-[#667085]">
          가입한 이메일로 임시 비밀번호를 전송했습니다.
        </p>

        <p className="mt-6 text-[15px] leading-[1.8] text-[#667085]">
          이메일을 확인하여 임시 비밀번호로 로그인한 후,
          반드시 비밀번호를 변경해주세요.
        </p>
      </div>

      {/* 추가 안내 */}
      <div className="mt-6 flex w-full items-center rounded-[16px] border border-[#E6C75A] bg-[#FFFBEF] px-5 py-4">

        <span className="text-[14px] leading-[1.6] text-[#B08B1A]">
          이메일이 도착하지 않았다면 스팸 메일함을 확인해주세요.
        </span>
      </div>

      {/* 버튼 */}
      <Link
        href="/auth/login/newpw"
        className="mt-8 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition hover:bg-[#367c79]"
      >
        비밀번호 변경하기
      </Link>
    </div>
  );
}