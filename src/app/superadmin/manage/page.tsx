import type { Metadata } from "next";
import ManagerManageClient from "@/features/superadmin/manager/components/ManagerManageClient";
import { mockManagers } from "@/features/superadmin/manager/types";

export const metadata: Metadata = {
  title: "관리자 계정 관리 | 알고가 슈퍼 관리자",
  description:
    "슈퍼 관리자가 관리자 계정을 조회, 검색, 생성, 수정, 삭제하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuperManagersPage() {
  return <ManagerManageClient initialManagers={mockManagers} />;
}
