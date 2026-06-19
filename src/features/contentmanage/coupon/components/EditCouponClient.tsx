"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import AdminLoadingState from "@/features/common/AdminLoadingState";
import { getLectureListAction } from "@/features/contentmanage/lecture/actions";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { updateCouponAction } from "../actions";
import { AdminCouponPayload, EditCouponClientProps } from "../types";
import { getCouponName } from "../utils/couponFormatters";
import { useAdminCouponDetail } from "../hooks/useAdminCouponDetail";
import CouponForm from "./CouponForm";

export default function EditCouponClient({
  couponId,
  courseId,
}: EditCouponClientProps) {
  const { coupon, isLoading, errorMessage } = useAdminCouponDetail(courseId, couponId);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCourses(await getLectureListAction());
      } catch {
        setCourses([]);
      }
    };

    void fetchCourses();
  }, []);

  const handleEdit = async (data: AdminCouponPayload) => {
    try {
      const nextCourseId = data.courseId || courseId;

      if (!Number.isSafeInteger(nextCourseId) || nextCourseId <= 0 || !Number.isSafeInteger(couponId) || couponId <= 0) {
        setApiError("쿠폰 수정에 필요한 ID가 올바르지 않습니다.");
        return false;
      }

      setApiError("");
      await updateCouponAction(nextCourseId, couponId, data);
      return true;
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : "쿠폰 수정에 실패했습니다.");
      return false;
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="쿠폰 정보를 불러오는 중입니다." />;
  }

  if (errorMessage || !coupon) {
    return <AdminErrorBanner message={errorMessage || "쿠폰 정보를 찾을 수 없습니다."} />;
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8" aria-labelledby="edit-coupon-title">
      <section aria-labelledby="edit-coupon-title">
        <SubHeader
          backHref="/contentadmin/coupon"
          backText="쿠폰 목록으로 돌아가기"
          title="쿠폰 수정"
          description="쿠폰 정보를 수정합니다."
        />
      </section>

      <AdminErrorBanner message={apiError} />

      <section className="mt-6" aria-label="쿠폰 수정 폼">
        <CouponForm
          courses={courses}
          isEdit
          initialData={{
            courseId: String(coupon.courseId || courseId),
            couponName: getCouponName(coupon),
            discountType: coupon.discountType || "RATE",
            discountValue: String(coupon.discountValue || ""),
            validDays: String(coupon.validDays || ""),
            active: String(coupon.active !== false),
          }}
          onSubmit={handleEdit}
        />
      </section>
    </main>
  );
}

