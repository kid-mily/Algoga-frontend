"use client";

import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/services/adminDisplay";
import AdminSidebarShell, {
  type AdminSidebarMenuItem,
} from "./AdminSidebarShell";

const menus: AdminSidebarMenuItem[] = [
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
  {
    name: "컨텐츠매니저로 이동",
    href: "/contentadmin/lecture",
    icon: "/images/book.svg",
    activeIcon: "/images/book-active.svg",
  },
  {
    name: "CS매니저로 이동",
    href: "/csadmin/inquiry",
    icon: "/images/qna.svg",
    activeIcon: "/images/qna-active.svg",
  },
  {
    name: "통계매니저로 이동",
    href: "/statisticadmin/finance-status",
    icon: "/images/chart.svg",
    activeIcon: "/images/chart-active.svg",
  },
  {
    name: "정산 매니저로 이동",
    href: "/moneyadmin/payments",
    icon: "/images/list.svg",
    activeIcon: "/images/list-active.svg",
  },
];

export default function SuperAdminSidebar() {
  const adminInfo = getCurrentAdminDisplayInfo("SUPER_ADMIN");

  return (
    <AdminSidebarShell
      badgeInitial="SA"
      title="Super Admin"
      navLabel="슈퍼 관리자 메뉴"
      sections={[{ items: menus }]}
      adminName={adminInfo.name}
      adminEmail={adminInfo.email}
      adminRole={adminInfo.role}
    />
  );
}
