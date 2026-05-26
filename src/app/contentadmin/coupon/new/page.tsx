"use client";

import CouponForm from "@/features/contentmanage/coupon/CouponForm";
import SubHeader from "@/features/contentmanage/SubHeader";

export default function CreateCouponPage() {

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/coupon"
        backText="쿠폰 목록으로 돌아가기"
        title="쿠폰 등록"
        description="새로운 쿠폰을 등록합니다"
      />

      {/* 폼 */}
      <CouponForm
        mode="create"
      />
    </div>
  );
}