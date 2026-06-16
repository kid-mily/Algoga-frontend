import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import UserFriendClient from "@/features/csadmin/user/components/UserFriendClient";

type UserFriendsPageProps = {
  params: Promise<{ userid: string }>;
};

const parseUserId = (value: string) => {
  if (!/^\d+$/.test(value)) return null;
  const userId = Number(value);
  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
};

export const metadata: Metadata = {
  title: "회원 친구 관리 | 알고가 CS 관리자",
  description: "회원별 친구 활동을 확인합니다.",
  robots: { index: false, follow: false },
};

export default async function UserFriendsPage({ params }: UserFriendsPageProps) {
  const { userid } = await params;
  const userId = parseUserId(userid);

  if (!userId) notFound();

  return (
    <main>
      <SubHeader
        backHref="/csadmin/user"
        backText="유저 활동 관리로 돌아가기"
        title="회원 친구 관리"
        description={`회원 #${userId}의 친구 활동을 확인합니다`}
      />

      <div className="mt-6">
        <UserFriendClient userId={userId} />
      </div>
    </main>
  );
}

