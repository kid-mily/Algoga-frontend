// id 찾기 완료 
import Image from "next/image";
import Link from "next/link";
import { FindIdCompleteProps } from "../types";

export default function FindIdComplete({
  userId,
}: FindIdCompleteProps) {
  return (
    <div className="flex w-[420px] flex-col items-center">
      {/* 아이콘 */}
      <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#439A97] text-[42px] text-white">
         <Image src="/images/check.svg" alt="체크아이콘" width={42} height={42} />
      </div>

      {/* 타이틀 */}
      <h1 className="mt-8 text-[36px] font-bold text-[#111827]">
        아이디 찾기 완료
      </h1>

      {/* 설명 */}
      <p className="mt-3 text-[16px] text-[#98A2B3]">
        입력하신 정보와 일치하는 아이디입니다
      </p>

      {/* 아이디 박스 */}
      <div className="mt-10 flex h-[160px] w-full flex-col items-center justify-center rounded-[24px] bg-[#F5F7FA]">
        <span className="text-[15px] text-[#98A2B3]">
          회원님의 아이디
        </span>

        <strong className="mt-3 text-[42px] font-bold text-[#439A97]">
          {userId}
        </strong>
      </div>

      {/* 로그인 버튼 */}
      <Link
        href="/auth/login"
        className="mt-10 flex h-[60px] w-full items-center justify-center rounded-[18px] bg-[#439A97] text-[18px] font-semibold text-white"
      >
        로그인하기
      </Link>
    </div>
  );
}
