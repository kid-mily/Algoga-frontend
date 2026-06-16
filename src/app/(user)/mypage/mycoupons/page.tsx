import MyPageLayout from "@/features/mypage/MyPageLayout";

export default function MyCouponsPage() {
  return (
    <MyPageLayout title="쿠폰함">
      <article className="rounded-2xl border border-[#E5EDF5] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-[#0A1628]">
          보유한 쿠폰이 없습니다.
        </h2>

        <p className="mt-2 text-sm text-[#8A9BB0]">
          발급받은 쿠폰은 이곳에서 확인할 수 있습니다.
        </p>
      </article>
    </MyPageLayout>
  );
}