import MyPageLayout from "@/features/mypage/MyPageLayout";

export default function ReservationsPage() {
  return (
    <MyPageLayout title="예약 내역">
      <article className="rounded-2xl border border-[#E5EDF5] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-[#0A1628]">
          예약 내역이 없습니다.
        </h2>

        <p className="mt-2 text-sm text-[#8A9BB0]">
          예약한 여행 상품이 생기면 이곳에서 확인할 수 있습니다.
        </p>
      </article>
    </MyPageLayout>
  );
}