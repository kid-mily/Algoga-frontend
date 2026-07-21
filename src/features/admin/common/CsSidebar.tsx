"use client";

import { getCurrentAdminDisplayInfo } from "@/features/admin/auth/services/adminDisplay";
import AdminSidebarShell, {
  type AdminSidebarMenuItem,
} from "./AdminSidebarShell";

const menus: AdminSidebarMenuItem[] = [
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
    name: "챗봇 예상 질문 관리",
    href: "/csadmin/chatbot",
    icon: "/images/chat-sidebar.svg",
    activeIcon: "/images/chat-sidebar-active.svg",
  },
  {
    name: "챗봇 운영 관리",
    href: "/csadmin/chatbot-operations",
    icon: "/images/chat-sidebar.svg",
    activeIcon: "/images/chat-sidebar-active.svg",
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
  const adminInfo = getCurrentAdminDisplayInfo("CS_MANAGER");

  return (
    <AdminSidebarShell
      badgeInitial="CS"
      title="CS Admin"
      navLabel="CS 관리자 메뉴"
      sections={[{ items: menus }]}
      adminName={adminInfo.name}
      adminEmail={adminInfo.email}
    />
  );
}
