"use client";

import FriendManagement from "@/features/friends/components/FriendManagement";
import MyPageLayout from "@/features/mypage/MyPageLayout";
import { useMyPageData } from "@/features/mypage/MyPageDataProvider";

export default function FriendsPage() {
  const { user } = useMyPageData();

  return (
    <MyPageLayout
      title="친구 관리"
      description="친구를 추가하고 함께 여행을 준비해 보세요."
      showBackButton
    >
      <FriendManagement personalCode={user?.personalCode ?? ""} />
    </MyPageLayout>
  );
}