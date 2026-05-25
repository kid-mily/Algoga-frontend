"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ContentSidebar() {

  // 현재 경로
  const pathname = usePathname();

  return (

    <aside className="flex w-[240px] flex-col border-r border-[#E4E7EC] bg-white">

      {/* 상단 관리자 */}
      <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-6 py-5">

        {/* 프로필 */}
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#439A97] text-[14px] font-semibold text-white">
          A
        </div>

        {/* 이름 */}
        <span className="text-[20px] font-semibold text-[#111827]">
          Admin
        </span>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 px-4 py-6">

        <div className="space-y-2">

          {/* 강의 관리 */}
          <Link
            href="/contentadmin/lecture"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/lecture"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/lecture"
                  ? "/images/book-active.svg"
                  : "/images/book.svg"
              }
              alt="강의"
              className="h-[20px] w-[20px]"
            />

            강의 관리
          </Link>

          {/* 퀴즈 관리 */}
          <Link
            href="/contentadmin/quiz"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/quiz"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/quiz"
                  ? "/images/quiz-active.svg"
                  : "/images/quiz.svg"
              }
              alt="퀴즈"
              className="h-[20px] w-[20px]"
            />

            퀴즈 관리
          </Link>

          {/* 쿠폰 관리 */}
          <Link
            href="/contentadmin/coupon"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/coupon"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/coupon"
                  ? "/images/coupon-active.svg"
                  : "/images/coupon.svg"
              }
              alt="쿠폰"
              className="h-[20px] w-[20px]"
            />

            쿠폰 관리
          </Link>

          {/* 패키지 관리 */}
          <Link
            href="/contentadmin/package"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/package"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/package"
                  ? "/images/package-active.svg"
                  : "/images/package.svg"
              }
              alt="패키지"
              className="h-[20px] w-[20px]"
            />

            패키지 관리
          </Link>

          {/* Q&A 관리 */}
          <Link
            href="/contentadmin/qna"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/qna"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/qna"
                  ? "/images/qna-active.svg"
                  : "/images/qna.svg"
              }
              alt="Q&A"
              className="h-[20px] w-[20px]"
            />

            Q&A 관리
          </Link>

          {/* 마일리지 관리 */}
          <Link
            href="/contentadmin/point"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/point"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/point"
                  ? "/images/point-active.svg"
                  : "/images/point.svg"
              }
              alt="마일리지"
              className="h-[20px] w-[20px]"
            />

            마일리지 관리
          </Link>
        </div>
      </nav>

      {/* 하단 */}
      <div className="border-t border-[#E4E7EC] p-4">

        {/* 홈 이동 */}
        <Link
          href="/contentadmin"
          className="flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] text-[#344054] transition hover:bg-[#F5F7FA]"
        >
          <img
            src="/images/home.svg"
            alt="홈"
            className="h-[20px] w-[20px]"
          />

          홈으로 나가기
        </Link>

        {/* 관리자 정보 */}
        <div className="mt-6 flex items-center gap-3 px-4">

          {/* 프로필 아이콘 */}
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#439A97] text-white">
            <img
              src="/images/profile.svg"
              alt="프로필"
              className="h-[18px] w-[18px]"
            />
          </div>

          {/* 텍스트 */}
          <div>
            <p className="text-[14px] font-semibold text-[#111827]">
              김관리자
              {/*일단 하드 코딩 나중에 백에서 데이터 받아오기 */}
            </p>

            <p className="text-[13px] text-[#98A2B3]">
              admin@algoga.kr
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}