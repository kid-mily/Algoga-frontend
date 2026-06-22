import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubHeader from "@/features/common/components/SubHeader";
import UserCommentListClient from "@/features/csadmin/user/components/UserCommentListClient";

type UserCommentsPageProps = {
  params: Promise<{ userid: string }>;
};

const parseUserId = (value: string) => {
  if (!/^\d+$/.test(value)) return null;
  const userId = Number(value);
  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
};

export const metadata: Metadata = {
  title: "회원 댓글 관리 | 알고가 CS 관리자",
  description: "회원별 댓글 목록과 상세 정보를 관리합니다.",
  robots: { index: false, follow: false },
};

export default async function UserCommentsPage({ params }: UserCommentsPageProps) {
  const { userid } = await params;
  const userId = parseUserId(userid);

  if (!userId) notFound();

  return (
    <main>
      <SubHeader
        backHref="/csadmin/user"
        backText="유저 조회로 돌아가기"
        title="회원 댓글 관리"
        description={`회원 #${userId}의 댓글 활동을 확인합니다`}
      />

      <div className="mt-6">
        <UserCommentListClient userId={userId} />
      </div>
    </main>
  );
}

