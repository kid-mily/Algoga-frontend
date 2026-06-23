"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/features/services/adminAuth.service";
import { clearAdminSessionActive } from "@/features/admin/auth/adminSession";

export default function ContentSidebar() {
  const pathname = usePathname();
  const adminInfo = {
    loginId: "관리자",
    role: "",
  };

  const handleAdminLogout = async () => {
    try {
      await adminLogout();
    } finally {
      clearAdminSessionActive();
      window.location.replace("/auth/adminlogin");
    }
  };

  const adminInitial = adminInfo.loginId ? adminInfo.loginId[0].toUpperCase() : "?";

  return (
    <aside className="flex w-[240px] flex-col border-r border-[#E4E7EC] bg-white">
      {/* 상단 관리자 */}
      <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-6 py-5">
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#439A97] text-[14px] font-semibold text-white">
          {adminInitial}
        </div>

        <span className="truncate text-[20px] font-semibold text-[#111827]">
          {adminInfo.loginId || "관리자"}
        </span>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
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

          <Link
            href="/contentadmin/package"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/package" ||
              pathname.startsWith("/contentadmin/package/")
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/package" ||
                pathname.startsWith("/contentadmin/package/")
                  ? "/images/package-active.svg"
                  : "/images/package.svg"
              }
              alt="패키지"
              className="h-[20px] w-[20px]"
            />
            패키지 관리
          </Link>

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

          <Link
            href="/contentadmin/review"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/review"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/review"
                  ? "/images/review-active.svg"
                  : "/images/review.svg"
              }
              alt="후기"
              className="h-[20px] w-[20px]"
            />
            후기 관리
          </Link>

          <Link
            href="/contentadmin/evalution"
            className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
              pathname === "/contentadmin/evalution"
                ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                : "text-[#344054] hover:bg-[#F5F7FA]"
            }`}
          >
            <img
              src={
                pathname === "/contentadmin/evalution"
                  ? "/images/evalution-active.svg"
                  : "/images/evaluation.svg"
              }
              alt="진단평가"
              className="h-[20px] w-[20px]"
            />
            진단평가 관리
          </Link>

          
        </div>
      </nav>

      {/* 하단 */}
      <div className="border-t border-[#E4E7EC] p-4">
        <button
          type="button"
          onClick={handleAdminLogout}
          className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] text-[#344054] transition hover:bg-[#F5F7FA]"
        >
          <img
            src="/images/home.svg"
            alt="로그아웃"
            className="h-[20px] w-[20px]"
          />
          로그아웃
        </button>

        {/* 관리자 정보: 토큰에서 가져온 값만 표시 */}
        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#439A97] text-white">
            <img
              src="/images/profile.svg"
              alt="프로필"
              className="h-[18px] w-[18px]"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#111827]">
              {adminInfo.loginId}
            </p>

            <p className="truncate text-[13px] text-[#98A2B3]">
              {adminInfo.role || "관리자"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
