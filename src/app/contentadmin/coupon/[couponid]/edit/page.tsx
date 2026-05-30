"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CouponForm from "@/features/contentmanage/coupon/CouponForm";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
// 🌟 단건 조회(getAdminCoupon) 대신 전체 조회(getAdminCoupons)를 불러옵니다!
import { getAdminCoupons, updateAdminCoupon } from "@/features/services/adminCoupon.service";

export default function CouponEditPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const couponId = Number(params.couponid);
  const courseId = Number(searchParams.get("courseId")); 
  
  const [coupon, setCoupon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!courseId) {
        alert("강의 ID가 누락되었습니다. 목록에서 다시 진입해주세요.");
        return;
      }
      try {
        // 🌟 백엔드 단건 조회 API가 500으로 터지므로, 전체 목록을 가져와서 직접 찾습니다! (완벽한 우회법)
        const list = await getAdminCoupons(courseId);
        const foundCoupon = list.find((c: any) => c.couponPolicyId === couponId);
        
        setCoupon(foundCoupon || null);
      } catch (error) {
        console.error("쿠폰 정보를 불러오지 못했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (couponId) fetchCoupon();
  }, [couponId, courseId]);

  if (!courseId) return <div className="p-10 text-red-500">잘못된 접근입니다. (Course ID 누락)</div>;
  if (isLoading) return <div className="p-10">데이터를 불러오는 중입니다...</div>;
  
  // 🌟 여기서 "쿠폰 정보를 찾을 수 없습니다"가 떴던 이유는 백엔드가 500을 줘서 coupon이 null이 되었기 때문입니다.
  if (!coupon) return <div className="p-10">쿠폰 정보를 찾을 수 없습니다.</div>;

  const handleEdit = async (payload: any) => {
    try {
      await updateAdminCoupon(courseId, couponId, payload);
      return true;
    } catch (error: any) {
      alert(error.message || "쿠폰 수정에 실패했습니다.");
      return false;
    }
  };

  return (
    <div className="p-6">
      <SimpleSubHeader title="쿠폰 수정" description="해당 강의의 쿠폰 세부 정보를 수정합니다." />
      <div className="mt-6">
        <CouponForm 
            isEdit={true}
            initialData={{
              courseId: String(coupon.courseId || courseId), // ID는 항상 문자열
              couponName: String(coupon.couponName || ""),
              discountType: String(coupon.discountType || "RATE"),
              discountValue: String(coupon.discountValue || "0"), // 🔥 무조건 문자열로 전달
              validDays: String(coupon.validDays || "0"),         // 🔥 무조건 문자열로 전달
              active: String(coupon.active)                       // 🔥 "true"/"false" 문자열로 전달
            }}
            onSubmit={handleEdit} 
          />
      </div>
    </div>
  );
}