import { notFound, redirect } from "next/navigation";
import PackagePaymentClient from "@/features/packagelounge/components/PackagePaymentClient";
import { toPackageDetailData } from "@/features/packagelounge/packageDetail.util";
import { getCourseDetail } from "@/features/services/lectureDetail.service";
import { getPackageLoungeDetail } from "@/features/services/package.service";
import { ApiRequestError } from "@/lib/api";
import type { CourseItem } from "@/features/classroom/components/types";

interface PackagePaymentPageProps {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<{ bookingId?: string; courseId?: string }>;
}

// 패키지 결제 페이지
// 결제(POST /payments)에는 bookingId가 반드시 필요해서, 예약 페이지에서 예약을 먼저 생성한 뒤
// 그 bookingId를 들고 이 페이지로 온다. bookingId가 없으면 예약 페이지로 돌려보낸다.
// 패키지 조회(공개 데이터)는 서버에서, 예약 조회(로그인 유저 전용 데이터)는
// PackagePaymentClient가 클라이언트에서 직접 호출한다 (브라우저 쿠키가 자동으로 실리도록)
export default async function PackagePaymentPage({
  params,
  searchParams,
}: PackagePaymentPageProps) {
  const { packageId } = await params;
  const { bookingId, courseId } = await searchParams;

  if (!bookingId) {
    redirect(`/packagelounge/${packageId}/booking`);
  }

  let detail;
  try {
    detail = await getPackageLoungeDetail(packageId);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    console.error("[packagelounge] 결제 페이지 패키지 조회 실패:", error);
    throw error;
  }

  const data = toPackageDetailData(detail);

  // 강의는 패키지와 백엔드에서 연결돼 있지 않아, 조회한 패키지의 countryId 기준으로 별도 조회한다
  let course: CourseItem | null = null;
  if (courseId) {
    course = await getCourseDetail(detail.countryId, courseId);
  }

  return (
    <PackagePaymentClient
      data={data}
      bookingId={bookingId}
      packageId={packageId}
      course={course}
    />
  );
}
