"use client";

import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/services/adminDisplay";
import AdminSidebarShell, {
  type AdminSidebarMenuSection,
} from "./AdminSidebarShell";

const menuSections: AdminSidebarMenuSection[] = [
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
  const adminInfo = getCurrentAdminDisplayInfo("STATISTICS_MANAGER");

  return (
    <AdminSidebarShell
      badgeInitial="ST"
      title="Statistics Admin"
      navLabel="통계 관리자 메뉴"
      sections={menuSections}
      adminName={adminInfo.name}
      adminEmail={adminInfo.email}
      asideClassName="flex w-[240px] shrink-0 flex-col border-r border-[#E4E7EC] bg-white"
      headerClassName="flex h-[77px] items-center gap-3 border-b border-[#E4E7EC] px-6"
      titleClassName="whitespace-nowrap text-[18px] font-semibold text-[#111827]"
    />
  );
}
