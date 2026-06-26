"use client";

import { useEffect, useState } from "react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import { getAdminUserFriends } from "@/features/services/adminUserActivity.service";
import UserActivityTabs from "@/features/csadmin/user/components/UserActivityTabs";
import { AdminUserFriend } from "@/features/csadmin/user/types";

type UserFriendClientProps = {
  userId: number;
};

export default function UserFriendClient({ userId }: UserFriendClientProps) {
  const [friends, setFriends] = useState<AdminUserFriend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadFriends = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAdminUserFriends(userId, controller.signal);

        if (controller.signal.aborted) return;

        setFriends(data);
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;

        setFriends([]);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "친구 목록을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadFriends();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <UserActivityTabs userId={String(userId)} activeTab="friends" />

      <AdminErrorBanner message={error} className="m-4" />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <caption className="sr-only">회원 {userId} 친구 목록</caption>
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[14px] font-semibold text-[#344054]">
              <th scope="col" className="w-[180px] px-6 py-4">친구 ID</th>
              <th scope="col" className="px-6 py-4">닉네임</th>
              <th scope="col" className="w-[220px] px-6 py-4">추가일</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-[#667085]">
                  친구 목록을 불러오는 중입니다...
                </td>
              </tr>
            ) : friends.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-[#667085]">
                  친구 목록이 없습니다.
                </td>
              </tr>
            ) : (
              friends.map((friend) => (
                <tr
                  key={friend.friendId}
                  className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
                >
                  <td className="px-6 py-5 font-semibold">
                    F{String(friend.friendId).padStart(3, "0")}
                  </td>
                  <td className="px-6 py-5 font-bold text-[#111827]">
                    {friend.friendNickname}
                  </td>
                  <td className="px-6 py-5 text-[#667085]">{friend.addedAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
