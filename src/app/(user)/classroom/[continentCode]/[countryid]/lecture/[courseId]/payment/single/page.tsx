import { notFound } from "next/navigation";
import { getCourseDetail } from "@/features/services/lectureDetail.service";
import SingleLecturePaymentClient from "@/features/payment/SingleLecturePaymentClient";

interface PageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function SingleLecturePaymentPage({ params }: PageProps) {
  const { continentCode, countryid, courseId } = await params;

  const numericCourseId = Number(courseId);

  if (!countryid || !Number.isInteger(numericCourseId) || numericCourseId <= 0) {
    notFound();
  }

  let course = null;

  try {
    course = await getCourseDetail(countryid, numericCourseId);
  } catch (error) {
    console.error("[single-payment-page] 강의 상세 조회 실패:", error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  return (
    <SingleLecturePaymentClient
      continentCode={continentCode}
      countryId={countryid}
      courseId={numericCourseId}
      initialCourse={course}
    />
  );
}