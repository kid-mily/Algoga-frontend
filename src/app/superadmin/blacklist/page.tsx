import type { Metadata } from "next";
import BlacklistManageClient from "@/features/superadmin/blacklist/components/BlacklistManageClient";

export const metadata: Metadata = {
  title: "블랙리스트 관리 | 알고가 슈퍼 관리자",
  description:
    "슈퍼 관리자가 블랙리스트 후보 유저와 블랙리스트 등록 유저를 조회하고 관리하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuperAdminBlacklistPage() {
  return <BlacklistManageClient />;
}
