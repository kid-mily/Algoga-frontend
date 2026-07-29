"use client";

import { useParams } from "next/navigation";
import MyPageLayout from "@/features/mypage/MyPageLayout";
import ReservationDetail from "@/features/mypage/reservations/ReservationDetail";

// 마이페이지 - 예약 상세 페이지
export default function ReservationDetailPage() {
  const params = useParams<{ reservationId: string }>();
  const reservationId = Number(params.reservationId);

  return (
    <MyPageLayout
      title="예약 상세"
      description="예약한 여행 상품의 상세 정보를 확인할 수 있어요."
      showBackButton
    >
      <ReservationDetail reservationId={reservationId} />
    </MyPageLayout>
  );
}
