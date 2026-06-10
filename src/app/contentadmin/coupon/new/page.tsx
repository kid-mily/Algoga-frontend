import type { Metadata } from "next";
import CreateCouponClient from "@/features/contentmanage/coupon/components/CreateCouponClient";

export const metadata: Metadata = {
  title: "쿠폰 등록 | 콘텐츠 관리자",
  description: "새로운 강의 쿠폰을 등록합니다.",
};

export default function CreateCouponPage() {
  return <CreateCouponClient />;
}