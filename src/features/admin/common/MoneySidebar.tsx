"use client";

import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/services/adminDisplay";
import AdminSidebarShell, {
  type AdminSidebarMenuItem,
} from "./AdminSidebarShell";

const menus: AdminSidebarMenuItem[] = [
  {
    name: "결제 내역 조회",
    href: "/moneyadmin/payments",
    icon: "/images/list.svg",
    activeIcon: "/images/list-active.svg",
  },
  {
    name: "환불 승인 관리",
    href: "/moneyadmin/refunds",
    icon: "/images/mcheck.svg",
    activeIcon: "/images/mcheck-active.svg",
  },
  {
    name: "월별 수익 조회",
    href: "/moneyadmin/revenue",
    icon: "/images/mchart.svg",
    activeIcon: "/images/mchart-active.svg",
  },
];

export default function MoneySidebar() {
  const adminInfo = getCurrentAdminDisplayInfo("SETTLEMENT_MANAGER");

  return (
    <AdminSidebarShell
      badgeInitial="$"
      title="Finance Admin"
      navLabel="정산 관리자 메뉴"
      sections={[{ items: menus }]}
      adminName={adminInfo.name}
      adminEmail={adminInfo.email}
      adminRole={adminInfo.role}
    />
  );
}
