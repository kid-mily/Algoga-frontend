"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/features/services/adminAuth.service";
import { clearAdminSessionActive } from "@/features/admin/auth/adminSession";
import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/adminDisplay";

const menus = [
  {
    name: "고객 문의 관리",
    href: "/csadmin/inquiry",
    icon: "/images/qna.svg",
    activeIcon: "/images/qna-active.svg",
  },
  {
    name: "환불 요청 관리",
    href: "/csadmin/refund",
    icon: "/images/refund.svg",
    activeIcon: "/images/Payment.svg",
  },
  {
    name: "공지사항 관리",
    href: "/csadmin/notice",
    icon: "/images/notice.svg",
    activeIcon: "/images/NoticeIcon-active.svg",
  },
  {
    name: "배너 관리",
    href: "/csadmin/banner",
    icon: "/images/banner.svg",
    activeIcon: "/images/banner-active.svg",
  },
  {
    name: "유저 활동 관리",
    href: "/csadmin/user",
    icon: "/images/users.svg",
    activeIcon: "/images/users-active.svg",
  },
  {
    name: "신고 내역 관리",
    href: "/csadmin/reports",
    icon: "/images/report.svg",
    activeIcon: "/images/report-active.svg",
  },
];

export default function CsSidebar() {
  const pathname = usePathname();
  const adminInfo = getCurrentAdminDisplayInfo("CS_MANAGER");

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      clearAdminSessionActive();
      window.location.replace("/auth/adminlogin");
    }
  };

  return (
    <aside className="flex w-[240px] flex-col border-r border-[#E4E7EC] bg-white">
      <header className="flex items-center gap-3 border-b border-[#E4E7EC] px-6 py-5">
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#6FA8A5] text-[14px] font-semibold text-white">
          CS
        </div>

        <span className="text-[20px] font-semibold text-[#111827]">
          CS Admin
        </span>
      </header>

      <nav className="flex-1 px-4 py-6" aria-label="CS 관리자 메뉴">
        <ul className="space-y-2">
          {menus.map((menu) => {
            const isActive =
              pathname === menu.href || pathname.startsWith(`${menu.href}/`);

            return (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
                    isActive
                      ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                      : "text-[#344054] hover:bg-[#F5F7FA]"
                  }`}
                >
                  <img
                    src={isActive ? menu.activeIcon : menu.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-[19px] w-[19px]"
                  />
                  {menu.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="border-t border-[#E4E7EC] p-4">
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] text-[#344054] hover:bg-[#F5F7FA]"
        >
          <img
            src="/images/home.svg"
            alt=""
            aria-hidden="true"
            className="h-[19px] w-[19px]"
          />
          로그아웃
        </button>

        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#6FA8A5] text-white">
            <img
              src="/images/profile.svg"
              alt=""
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
          </div>

          <div>
            <p className="text-[14px] font-semibold text-[#111827]">
              {adminInfo.name}
            </p>
            <p className="text-[13px] text-[#98A2B3]">{adminInfo.email}</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
