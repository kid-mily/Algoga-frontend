import type { Metadata } from "next";
import EditCouponClient from "@/features/contentmanage/coupon/components/EditCouponClient";

export const metadata: Metadata = {
  title: "쿠폰 수정 | 콘텐츠 관리자",
  description: "등록된 쿠폰 정보를 수정합니다.",
};

type EditCouponPageProps = {
  params: Promise<{ couponid: string }>;
  searchParams: Promise<{ courseId?: string }>;
};

export default async function EditCouponPage({
  params,
  searchParams,
}: EditCouponPageProps) {
  const { couponid } = await params;
  const { courseId } = await searchParams;

  return (
    <EditCouponClient
      couponId={Number(couponid)}
      courseId={Number(courseId)}
    />
  );
}