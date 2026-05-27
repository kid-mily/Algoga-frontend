"use client";

import { useParams } from "next/navigation";

import CouponForm from "@/features/contentmanage/coupon/CouponForm";
import SubHeader from "@/features/contentmanage/SubHeader";

import {
  coupons,
} from "@/features/contentmanage/MockData";

export default function EditCouponPage() {

  const params = useParams();

  const couponid =
    Number(params.couponid);

  // 현재 쿠폰 찾기
  const coupon =
    coupons.find(
      (item) =>
        item.id === couponid
    );

  // 없으면 종료
  if (!coupon) {

    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/coupon"
        backText="쿠폰 목록으로 돌아가기"
        title="쿠폰 수정"
        description="쿠폰 정보를 수정합니다"
      />

      {/* 폼 */}
      <CouponForm
        mode="edit"

        initialCoupon={{
          name: coupon.name,

          discount:
            coupon.discount,

          startDate:
            coupon.startDate,

          endDate:
            coupon.endDate,

          lecture:
            coupon.lecture,

          categories:
            coupon.categories || [],
        }}
      />
    </div>
  );
}