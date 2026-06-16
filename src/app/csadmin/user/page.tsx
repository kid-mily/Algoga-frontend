import type { Metadata } from "next";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import UserActivityListClient from "@/features/csadmin/user/components/UserActivityListClient";

export const metadata: Metadata = {
  title: "유저 활동 관리 | 알고가 CS 관리자",
  description: "CS 관리자가 회원별 게시글과 댓글 활동을 확인합니다.",
  robots: { index: false, follow: false },
};

export default function CsUserPage() {
  return (
    <main>
      <SimpleSubHeader
        title="유저 활동 관리"
        description="유저별 활동 내역을 조회하고 관리합니다"
      />

      <div className="mt-6">
        <UserActivityListClient />
      </div>
    </main>
  );
}

