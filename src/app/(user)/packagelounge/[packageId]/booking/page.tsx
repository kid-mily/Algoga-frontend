import BookingPageClient from "@/features/packagelounge/components/BookingPageClient";
import { PACKAGE_DETAIL_DATA } from "@/features/packagelounge/packageDetail.data";

interface PackageBookingPageProps {
  params: Promise<{ packageId: string }>;
}

// 패키지 예약 페이지 (디자인 확인용, 실제 결제/예약 API 연동 없음)
export default async function PackageBookingPage({
  params,
}: PackageBookingPageProps) {
  const { packageId } = await params;
  const data = PACKAGE_DETAIL_DATA;

  return <BookingPageClient data={data} packageId={packageId} />;
}
