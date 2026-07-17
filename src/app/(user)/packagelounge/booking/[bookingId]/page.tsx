import BookingConfirmation from "@/features/packagelounge/components/BookingConfirmation";

interface BookingConfirmPageProps {
  params: Promise<{ bookingId: string }>;
}

// 예약 생성 직후 예약 상세(GET /bookings/{bookingId})를 보여주는 확인 페이지
// 예약 조회는 로그인한 유저 전용 데이터라, 브라우저 쿠키가 자동으로 실리도록
// 클라이언트 컴포넌트(BookingConfirmation)에서 직접 호출한다
export default async function BookingConfirmPage({
  params,
}: BookingConfirmPageProps) {
  const { bookingId } = await params;

  return <BookingConfirmation bookingId={bookingId} />;
}
