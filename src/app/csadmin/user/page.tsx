import type { Metadata } from "next";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import UserActivityListClient from "@/features/csadmin/user/components/UserActivityListClient";

export const metadata: Metadata = {
  title: "유저 조회 | 알고가 CS 관리자",
  description: "CS 관리자가 회원 목록과 상세 활동 정보를 조회합니다.",
  robots: { index: false, follow: false },
};

export default function CsUserPage() {
  return (
    <main>
      <SimpleSubHeader
        title="유저 조회"
        description="회원 목록과 상세 활동 정보를 확인합니다"
      />

      <div className="mt-6">
        <UserActivityListClient />
      </div>
    </main>
  );
}

