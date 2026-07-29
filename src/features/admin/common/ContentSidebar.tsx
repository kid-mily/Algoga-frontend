"use client";

import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/services/adminDisplay";
import AdminSidebarShell, {
  type AdminSidebarMenuItem,
} from "./AdminSidebarShell";

const menus: AdminSidebarMenuItem[] = [
  {
    name: "강의 관리",
    href: "/contentadmin/lecture",
    icon: "/images/book.svg",
    activeIcon: "/images/book-active.svg",
  },
  {
    name: "삭제 강의 목록",
    href: "/contentadmin/lecture/deleted",
    icon: "/images/delete.svg",
    activeIcon: "/images/delete.svg",
  },
  {
    name: "쿠폰 관리",
    href: "/contentadmin/coupon",
    icon: "/images/coupon.svg",
    activeIcon: "/images/coupon-active.svg",
  },
  {
    name: "마일리지 관리",
    href: "/contentadmin/point",
    icon: "/images/point.svg",
    activeIcon: "/images/point-active.svg",
  },
  {
    name: "패키지 관리",
    href: "/contentadmin/package",
    icon: "/images/package.svg",
    activeIcon: "/images/package-active.svg",
  },
  {
    name: "Q&A 관리",
    href: "/contentadmin/qna",
    icon: "/images/qna.svg",
    activeIcon: "/images/qna-active.svg",
  },
  {
    name: "후기 관리",
    href: "/contentadmin/review",
    icon: "/images/review.svg",
    activeIcon: "/images/review-active.svg",
  },
  {
    name: "진단평가 관리",
    href: "/contentadmin/evalution",
    icon: "/images/evaluation.svg",
    activeIcon: "/images/evalution-active.svg",
  },
];

export default function ContentSidebar() {
  const adminInfo = getCurrentAdminDisplayInfo("CONTENT_MANAGER");

  return (
    <AdminSidebarShell
      badgeInitial={adminInfo.initial}
      badgeColorClassName="bg-[#439A97]"
      title="Content Admin"
      navLabel="컨텐츠 관리자 메뉴"
      sections={[{ items: menus }]}
      adminName={adminInfo.name}
      adminEmail={adminInfo.email}
      adminRole={adminInfo.role}
    />
  );
}
