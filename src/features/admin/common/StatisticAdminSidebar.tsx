"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Clock3,
  CreditCard,
  DollarSign,
  Globe2,
  Heart,
  Tag,
  TrendingUp,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { adminLogout } from "@/features/services/adminAuth.service";
import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/services/adminDisplay";
import { clearAdminSessionActive } from "@/features/admin/auth/services/adminSession";

type StatisticMenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
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
        icon: DollarSign,
      },
    ],
  },
  {
    label: "유입/관심",
    items: [
      {
        name: "유입경로별 전환",
        href: "/statisticadmin/user-acquisition-conversion",
        icon: UsersRound,
      },
      {
        name: "나라·강의별 관심도",
        href: "/statisticadmin/country-course-interest",
        icon: Globe2,
      },
    ],
  },
  {
    label: "이탈지점",
    items: [
      {
        name: "잔금 관리",
        href: "/statisticadmin/balance-management",
        icon: CreditCard,
      },
      {
        name: "환불 관리",
        href: "/statisticadmin/refund-management",
        icon: TrendingUp,
      },
    ],
  },
  {
    label: "수익지점",
    items: [
      {
        name: "강의 → 예약 전환",
        href: "/statisticadmin/course-reservation-conversion",
        icon: BookOpen,
      },
      {
        name: "쿠폰 → 예약 전환",
        href: "/statisticadmin/coupon-reservation-conversion",
        icon: Tag,
      },
      {
        name: "재구매 · LTV",
        href: "/statisticadmin/repurchase-ltv",
        icon: Heart,
      },
      {
        name: "나라별 수익성 종합",
        href: "/statisticadmin/country-profitability-summary",
        icon: Clock3,
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
    <aside className="flex w-[218px] shrink-0 flex-col border-r border-[#EEF2F6] bg-white">
      <header className="flex h-[70px] items-center gap-3 px-4">
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[9px] bg-[#2BB3A3] text-white">
          <BarChart3 aria-hidden="true" className="h-[15px] w-[15px]" strokeWidth={2} />
        </div>
        <span className="text-[14px] font-bold text-[#20242A]">
          Analytics Admin
        </span>
      </header>

      <nav className="flex-1 px-2.5 pt-1" aria-label="통계 관리자 메뉴">
        {menuSections.map((section, sectionIndex) => (
          <div
            key={section.label ?? section.items[0]?.href ?? sectionIndex}
            className={sectionIndex === 0 ? "" : "mt-[18px]"}
          >
            {section.label ? (
              <p className="mb-2 px-3 text-[10px] font-semibold text-[#B4BBC7]">
                {section.label}
              </p>
            ) : null}

            <ul className="space-y-1">
              {section.items.map((menu) => {
                const active =
                  pathname === menu.href || pathname.startsWith(`${menu.href}/`);
                const Icon = menu.icon;

                return (
                  <li key={menu.href}>
                    <Link
                      href={menu.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-[36px] items-center gap-3 rounded-[9px] px-3 text-[12px] leading-snug transition ${
                        active
                          ? "bg-[#E7F4EC] font-bold text-[#439A97]"
                          : "font-semibold text-[#5B6472] hover:bg-[#F5F7FA]"
                      }`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`h-[15px] w-[15px] shrink-0 ${
                          active ? "text-[#16A394]" : "text-[#6B7280]"
                        }`}
                        strokeWidth={1.8}
                      />
                      <span className="break-keep">{menu.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#E4E7EC] p-4">
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] text-[#344054] transition hover:bg-[#F5F7FA]"
        >
          <img
            src="/images/home.svg"
            alt=""
            aria-hidden="true"
            className="h-[18px] w-[18px] shrink-0"
          />
          로그아웃
        </button>

        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#6FA8A5] text-white">
            <UserRound
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
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
      </div>
    </aside>
  );
}
