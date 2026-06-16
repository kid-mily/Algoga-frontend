import type { Metadata } from "next";
import CouponManageClient from "@/features/contentmanage/coupon/components/CouponManageClient";

export const metadata: Metadata = {
  title: "쿠폰 관리 | 콘텐츠 관리자",
  description: "강의별 쿠폰을 등록하고 관리합니다.",
};

export default function CouponPage() {
  return <CouponManageClient />;
}