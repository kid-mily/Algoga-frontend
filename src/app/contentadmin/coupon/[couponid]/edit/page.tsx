"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // 🌟 useSearchParams 추가

import CouponForm from "@/features/contentmanage/coupon/CouponForm";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import LoadingSpinner from "@/features/common/LoadingSpinner";

import { getAdminCoupon, updateAdminCoupon } from "@/features/services/adminCoupon.service";

export default function EditCouponPage() {
  const params = useParams();
  const searchParams = useSearchParams(); // 🌟 주소창 뒤의 ? 쿼리를 가져오는 훅
  const router = useRouter();
  
  const couponid = Number(params.couponid);
  const courseId = Number(searchParams.get("courseId")); // 🌟 주소창에서 courseId 꺼내기

  const [coupon, setCoupon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // 1. 쿠폰 기존 정보 불러오기
  useEffect(() => {
    const fetchCoupon = async () => {
      // courseId가 없으면 백엔드에 요청 자체를 할 수 없으므로 차단
      if (!courseId) {
        setApiError("강의 ID(courseId) 정보가 누락되어 쿠폰을 불러올 수 없습니다. 목록에서 다시 접근해주세요.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 🌟 서비스 파일 요구사항에 맞게 courseId와 couponid 2개를 모두 넘겨줌!
        const data = await getAdminCoupon(courseId, couponid);
        setCoupon(data);
      } catch (error: any) {
        setApiError(error.message || "쿠폰 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (couponid) fetchCoupon();
  }, [couponid, courseId]);

  // 2. 수정 버튼 눌렀을 때 실행될 함수
  const handleEdit = async (data: any) => {
    try {
      setApiError("");
      // 🌟 여기도 서비스 파일 요구사항에 맞게 courseId, couponid, data 3개를 순서대로 넘겨줌!
      await updateAdminCoupon(courseId, couponid, data);
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
      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/coupon"
        backText="쿠폰 목록으로 돌아가기"
        title="쿠폰 수정"
        description="쿠폰 정보를 수정합니다"
      />

      {/* 에러 발생 시 출력 */}
      {apiError && (
        <div className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
          🚨 {apiError}
        </div>
      )}

      {/* 쿠폰 폼 */}
      {coupon && (
        <div className="mt-6">
          <CouponForm
            isEdit={true}
            initialData={{
              courseId: String(coupon.courseId || courseId), // 꺼내온 courseId 기본값 세팅
              couponName: coupon.couponName || coupon.name || "",
              discountType: coupon.discountType || "RATE",
              discountValue: String(coupon.discountValue || coupon.discount || ""),
              validDays: String(coupon.validDays || coupon.duration || 0),
              active: String(coupon.active !== false && coupon.status !== "INACTIVE"),
            }}
            onSubmit={handleEdit}
          />
        </div>
      )}
    </div>
  );
}