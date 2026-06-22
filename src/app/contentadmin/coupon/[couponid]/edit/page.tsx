import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditCouponClient from "@/features/contentmanage/coupon/components/EditCouponClient";

export const metadata: Metadata = {
  title: "쿠폰 수정 | 콘텐츠 관리자",
  description: "등록된 쿠폰 정보를 수정합니다.",
};

type EditCouponPageProps = {
  params: Promise<{ couponid: string }>;
  searchParams: Promise<{ courseId?: string | string[] }>;
};

export default async function EditCouponPage({
  params,
  searchParams,
}: EditCouponPageProps) {
  const { couponid } = await params;
  const { courseId: rawCourseId } = await searchParams;
  const courseIdValue = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
  const couponId = Number(couponid);
  const courseId = Number(courseIdValue);

  // 주소값이 이상하면 404 페이지로 보내는 검사 코드
  if (
    !courseIdValue ||
    isNaN(couponId) ||
    isNaN(courseId) ||
    !Number.isInteger(couponId) ||
    !Number.isInteger(courseId) ||
    couponId <= 0 ||
    courseId <= 0
  ) {
    notFound();
  }

  return <EditCouponClient couponId={couponId} courseId={courseId} />;
}

