"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CouponForm from "@/features/contentmanage/coupon/CouponForm";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import LoadingSpinner from "@/features/common/LoadingSpinner";
import { getAdminCoupon, updateAdminCoupon } from "@/features/services/adminCoupon.service";

export default function EditCouponPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const couponId = Number(params.couponid);
  const courseId = Number(searchParams.get("courseId"));
  const [coupon, setCoupon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!courseId) {
        setApiError("강의 ID가 없어 쿠폰 정보를 불러올 수 없습니다. 목록에서 다시 접근해주세요.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getAdminCoupon(courseId, couponId);
        setCoupon(data);
      } catch (error: any) {
        setApiError(error.message || "쿠폰 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (couponId) fetchCoupon();
  }, [couponId, courseId]);

  const handleEdit = async (data: any) => {
    try {
      setApiError("");
      await updateAdminCoupon(courseId, couponId, data);
      return true;
    } catch (error: any) {
      setApiError(error.message || "쿠폰 수정에 실패했습니다.");
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
        <LoadingSpinner text="쿠폰 정보를 불러오는 중입니다..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/coupon"
        backText="쿠폰 목록으로 돌아가기"
        title="쿠폰 수정"
        description="쿠폰 정보를 수정합니다."
      />
      {apiError && (
        <div className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
          {apiError}
        </div>
      )}
      {coupon && (
        <div className="mt-6">
          <CouponForm
            isEdit
            initialData={{
              courseId: String(coupon.courseId || courseId),
              couponName: coupon.couponName || coupon.name || "",
              discountType: coupon.discountType || "RATE",
              discountValue: String(coupon.discountValue || coupon.discount || ""),
              validDays: String(coupon.validDays || coupon.duration || ""),
              active: String(coupon.active !== false && coupon.status !== "INACTIVE"),
            }}
            onSubmit={handleEdit}
          />
        </div>
      )}
    </div>
  );
}
