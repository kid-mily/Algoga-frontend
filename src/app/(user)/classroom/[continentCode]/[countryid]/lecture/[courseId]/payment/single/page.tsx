import { notFound } from "next/navigation";
import { getCourseDetail } from "@/features/services/lectureDetail.service";
import SingleLecturePaymentClient from "@/features/payment/SingleLecturePaymentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const course = await getCourseDetail(countryid, numericCourseId);

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