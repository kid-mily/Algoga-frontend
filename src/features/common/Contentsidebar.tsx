"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AdminTokenPayload {
  sub?: string; // loginId
  role?: string;
  type?: string;
  id?: number;
  exp?: number;
}

const decodeJwtPayload = (token: string): AdminTokenPayload | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => {
          return `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`;
        })
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

const formatRole = (role?: string) => {
  if (!role) return "";

  return role
    .replace("ROLE_", "")
    .replaceAll("_", " ");
};

export default function ContentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [adminLoginId, setAdminLoginId] = useState("");
  const [adminRole, setAdminRole] = useState("");

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");

    if (!adminAccessToken) {
      router.replace("/auth/admin-login");
      return;
    }

    const payload = decodeJwtPayload(adminAccessToken);

    if (!payload || payload.type !== "ADMIN") {
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      router.replace("/auth/admin-login");
      return;
    }

    setAdminLoginId(payload.sub || "");
    setAdminRole(payload.role || "");
  }, [router]);

  const handleAdminLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");

    router.push("/auth/adminlogin");
    router.refresh();
  };

  const adminInitial = adminLoginId ? adminLoginId[0].toUpperCase() : "?";

  return (
    <aside className="flex w-[240px] flex-col border-r border-[#E4E7EC] bg-white">
      {/* 상단 관리자 */}
      <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-6 py-5">
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#439A97] text-[14px] font-semibold text-white">
          {adminInitial}
        </div>

        <span className="truncate text-[20px] font-semibold text-[#111827]">
          {adminLoginId || "관리자"}
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
              {adminLoginId}
            </p>

            <p className="truncate text-[13px] text-[#98A2B3]">
              {formatRole(adminRole)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}