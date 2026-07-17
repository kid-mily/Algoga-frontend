import { notFound } from "next/navigation";
import BookingPageClient from "@/features/packagelounge/components/BookingPageClient";
import { toPackageDetailData } from "@/features/packagelounge/packageDetail.util";
import { getCourseDetail } from "@/features/services/lectureDetail.service";
import { getPackageLoungeDetail } from "@/features/services/package.service";
import { ApiRequestError } from "@/lib/api";
import type { CourseItem } from "@/features/classroom/components/types";

interface PackageBookingPageProps {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<{ courseId?: string }>;
}

// 패키지 예약 페이지
// 강의(course)는 백엔드에서 패키지와 연결돼 있지 않아, 조회한 패키지의 countryId 기준으로 별도 조회한다
export default async function PackageBookingPage({
  params,
  searchParams,
}: PackageBookingPageProps) {
  const { packageId } = await params;
  const { courseId } = await searchParams;

  let detail;
  try {
    detail = await getPackageLoungeDetail(packageId);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    console.error("[packagelounge] 예약 페이지 패키지 조회 실패:", error);
    throw error;
  }

  const data = toPackageDetailData(detail);

  let course: CourseItem | null = null;
  if (courseId) {
    course = await getCourseDetail(detail.packageItem.countryId, courseId);
  }

  return (
    <BookingPageClient
      data={data}
      packageItem={detail.packageItem}
      packageId={packageId}
      course={course}
    />
  );
}
