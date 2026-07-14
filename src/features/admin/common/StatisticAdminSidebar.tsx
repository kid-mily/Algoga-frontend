"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/features/services/adminAuth.service";
import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/services/adminDisplay";
import { clearAdminSessionActive } from "@/features/admin/auth/services/adminSession";

type StatisticMenuItem = {
  name: string;
  href: string;
  icon: string;
  activeIcon: string;
};

type StatisticMenuSection = {
  label?: string;
  items: StatisticMenuItem[];
};

const menuSections: StatisticMenuSection[] = [
  {
    items: [
      {
        name: "재무 현황",
        href: "/statisticadmin/finance-status",
        icon: "/images/chart.svg",
        activeIcon: "/images/chart-active.svg",
      },
    ],
  },
  {
    label: "유입/관심",
    items: [
      {
        name: "유입경로별 전환",
        href: "/statisticadmin/user-acquisition-conversion",
        icon: "/images/users.svg",
        activeIcon: "/images/users-active.svg",
      },
      {
        name: "나라·강의별 관심도",
        href: "/statisticadmin/country-course-interest",
        icon: "/images/global-inactive.svg",
        activeIcon: "/images/global.svg",
      },
    ],
  },
  {
    label: "이탈지점",
    items: [
      {
        name: "잔금 관리",
        href: "/statisticadmin/balance-management",
        icon: "/images/list.svg",
        activeIcon: "/images/list-active.svg",
      },
      {
        name: "환불 관리",
        href: "/statisticadmin/refund-management",
        icon: "/images/refund.svg",
        activeIcon: "/images/Payment.svg",
      },
    ],
  },
  {
    label: "수익지점",
    items: [
      {
        name: "강의 → 예약 전환",
        href: "/statisticadmin/course-reservation-conversion",
        icon: "/images/book.svg",
        activeIcon: "/images/book-active.svg",
      },
      {
        name: "쿠폰 → 예약 전환",
        href: "/statisticadmin/coupon-reservation-conversion",
        icon: "/images/coupon.svg",
        activeIcon: "/images/coupon-active.svg",
      },
      {
        name: "재구매 · LTV",
        href: "/statisticadmin/repurchase-ltv",
        icon: "/images/gift.svg",
        activeIcon: "/images/gift-active.svg",
      },
      {
        name: "나라별 수익성 종합",
        href: "/statisticadmin/country-profitability-summary",
        icon: "/images/global-inactive.svg",
        activeIcon: "/images/global.svg",
      },
    ],
  },
];

export default function StatisticAdminSidebar() {
  const pathname = usePathname();
  const adminInfo = getCurrentAdminDisplayInfo("STATISTICS_MANAGER");

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
          ST
        </div>

        <span className="text-[20px] font-semibold text-[#111827]">
          Statistics Admin
        </span>
      </header>

      <nav className="flex-1 px-4 py-6" aria-label="통계 관리자 메뉴">
        {menuSections.map((section, sectionIndex) => (
          <div
            key={section.label ?? section.items[0]?.href ?? sectionIndex}
            className={sectionIndex === 0 ? "" : "mt-6"}
          >
            {section.label ? (
              <p className="mb-2 px-4 text-[12px] font-semibold text-[#98A2B3]">
                {section.label}
              </p>
            ) : null}

            <ul className="space-y-2">
              {section.items.map((menu) => {
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
          </div>
        ))}
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

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#111827]">
              {adminInfo.name}
            </p>
            <p className="truncate text-[13px] text-[#98A2B3]">
              {adminInfo.email}
            </p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
