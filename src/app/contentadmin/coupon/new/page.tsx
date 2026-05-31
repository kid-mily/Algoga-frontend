"use client";

import { useState } from "react";
import CouponForm from "@/features/contentmanage/coupon/CouponForm";
import SubHeader from "@/features/contentmanage/common/SubHeader";

// 🌟 등록용 API 임포트
import { createAdminCoupon } from "@/features/services/adminCoupon.service";

export default function CreateCouponPage() {
  const [apiError, setApiError] = useState("");

  // 🌟 쿠폰 등록 버튼을 눌렀을 때 실행될 함수
  const handleCreate = async (data: any) => {
    try {
      setApiError("");
      await createAdminCoupon(data);
      
      // 등록 성공 시 폼 안에서 완료 모달을 띄우도록 true 반환
      return true;
    } catch (error: any) {
      setApiError(error.message || "쿠폰 등록에 실패했습니다.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/coupon"
        backText="쿠폰 목록으로 돌아가기"
        title="쿠폰 등록"
        description="새로운 쿠폰을 등록합니다"
      />

      {/* 🌟 에러 발생 시 빨간 박스 출력 */}
      {apiError && (
        <div className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
           {apiError}
        </div>
      )}

      {/* 폼 */}
      <div className="mt-6">
        <CouponForm
          isEdit={false}        
          onSubmit={handleCreate} 
        />
      </div>
    </div>
  );
}