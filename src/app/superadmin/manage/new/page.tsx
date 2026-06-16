import type { Metadata } from "next";
import ManagerFormClient from "@/features/superadmin/manager/components/ManagerFormClient";

export const metadata: Metadata = {
  title: "관리자 계정 생성 | 알고가 슈퍼 관리자",
  description: "새 관리자 계정을 생성하고 권한을 부여합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateManagerPage() {
  return <ManagerFormClient mode="create" />;
}
