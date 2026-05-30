"use client";

import CouponForm from "@/features/contentmanage/coupon/CouponForm";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { createAdminCoupon } from "@/features/services/adminCoupon.service";

export default function CouponCreatePage() {
  const handleCreate = async (payload: any) => {
    try {
      await createAdminCoupon(payload);
      return true; 
    } catch (error: any) {
      alert(error.message || "쿠폰 등록에 실패했습니다.");
      return false;
    }
  };

  return (
    <div className="p-6">
      <SimpleSubHeader title="쿠폰 등록" description="특정 강의에 발급될 쿠폰 정책을 생성합니다." />
      <div className="mt-6">
        <CouponForm onSubmit={handleCreate} isEdit={false} />
      </div>
    </div>
  );
}