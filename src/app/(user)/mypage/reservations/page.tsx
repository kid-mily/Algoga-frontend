import MyPageLayout from "@/features/mypage/MyPageLayout";
import ReservationPage from "@/features/mypage/reservations/ReservationPage";

// 마이페이지 - 예약 내역 페이지
export default function ReservationsPage() {
  return (
    <MyPageLayout
      title="예약 내역"
      description="예약한 여행 상품과 이용 상태를 확인할 수 있어요."
      showBackButton
    >
      <ReservationPage />
    </MyPageLayout>
  );
}
