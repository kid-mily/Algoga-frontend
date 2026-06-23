"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/features/services/adminAuth.service";
import { clearAdminSessionActive } from "@/features/admin/auth/adminSession";

const menus = [
  {
    name: "관리자 계정 관리",
    href: "/superadmin/manage",
    icon: "/images/users.svg",
    activeIcon: "/images/users-active.svg",
  },
  {
    name: "블랙리스트 관리",
    href: "/superadmin/blacklist",
    icon: "/images/blacklist.svg",
    activeIcon: "/images/blacklist-active.svg",
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

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
          SA
        </div>
        <span className="text-[20px] font-semibold text-[#111827]">
          Super Admin
        </span>
      </header>

      <nav className="flex-1 px-4 py-6" aria-label="슈퍼 관리자 메뉴">
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
              슈퍼관리자
            </p>
            <p className="text-[13px] text-[#98A2B3]">super@algoga.kr</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
