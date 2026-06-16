import MyPageLayout from "@/features/mypage/MyPageLayout";

export default function FriendsPage() {
  return (
    <MyPageLayout title="친구 관리">
      <article className="rounded-2xl border border-[#E5EDF5] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-[#0A1628]">
          친구 관리 기능을 준비 중입니다.
        </h2>

        <p className="mt-2 text-sm text-[#8A9BB0]">
          친구 목록과 초대 기능이 열리면 이곳에서 확인할 수 있습니다.
        </p>
      </article>
    </MyPageLayout>
  );
}