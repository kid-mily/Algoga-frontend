"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/features/services/adminAuth.service";
import { getCurrentAdminPayload } from "@/lib/adminToken";

const menus = [
  {
    name: "예약 전환율 분석",
    href: "/statisticadmin/reservation-conversion",
    icon: "/images/chart.svg",
    activeIcon: "/images/chart-active.svg",
  },
  {
    name: "쿠폰 사용 현황 조회",
    href: "/statisticadmin/coupons",
    icon: "/images/gift.svg",
    activeIcon: "/images/gift-active.svg",
  },
  {
    name: "수강률 분석",
    href: "/statisticadmin/lecture-analysis",
    icon: "/images/book.svg",
    activeIcon: "/images/book-active.svg",
  },
  {
    name: "나라별 인기도",
    href: "/statisticadmin/country-popular",
    icon: "/images/global-inactive.svg",
    activeIcon: "/images/global.svg",
  },
  {
    name: "유저 유입 경로 통계",
    href: "/statisticadmin/user",
    icon: "/images/users.svg",
    activeIcon: "/images/users-active.svg",
  },
];

export default function StatisticAdminSidebar() {
  const pathname = usePathname();
  const adminPayload = getCurrentAdminPayload();
  const adminName = adminPayload?.sub ?? "통계 관리자";
  const adminEmail = adminPayload?.role ?? adminPayload?.authority ?? "STATISTICS_MANAGER";

  const handleLogout = async () => {
    await Promise.resolve(adminLogout());
    window.location.replace("/auth/adminlogin");
  };

  return (
    <aside className="flex w-[240px] flex-col border-r border-[#E4E7EC] bg-white">
      <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-6 py-5">
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#6FA8A5] text-[13px] font-semibold text-white">
          ST
        </div>
        <span className="text-[20px] font-semibold text-[#111827]">
          Stats Admin
        </span>
      </div>

      <nav className="flex-1 px-4 py-6" aria-label="통계 관리자 메뉴">
        <ul className="space-y-2">
          {menus.map((menu) => {
            const active =
              pathname === menu.href || pathname.startsWith(`${menu.href}/`);

            return (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] ${
                    active
                      ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                      : "text-[#344054] hover:bg-[#F5F7FA]"
                  }`}
                >
                  <Image
                    src={active ? menu.activeIcon : menu.icon}
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={18}
                    priority={false}
                  />
                  {menu.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#E4E7EC] p-4">
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] text-[#344054] hover:bg-[#F5F7FA]"
        >
          <Image src="/images/home.svg" alt="" aria-hidden="true" width={18} height={18} />
          로그아웃
        </button>

        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#6FA8A5]">
            <Image
              src="/images/profile.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px] shrink-0 object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#111827]">{adminName}</p>
            <p className="text-[13px] text-[#98A2B3]">{adminEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
