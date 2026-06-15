import UserActivityTabs from "@/features/csadmin/user/UserActivityTabs";

type UserFriendClientProps = {
  userId: number;
};

export default function UserFriendClient({ userId }: UserFriendClientProps) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <UserActivityTabs userId={String(userId)} activeTab="friends" />

      <div className="px-6 py-10 text-center">
        <p className="text-[16px] font-semibold text-[#111827]">친구 목록 API 준비 중입니다.</p>
        <p className="mt-2 text-[14px] text-[#667085]">
          회원 {userId}의 친구 목록은 백엔드 API가 준비되면 연결할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
