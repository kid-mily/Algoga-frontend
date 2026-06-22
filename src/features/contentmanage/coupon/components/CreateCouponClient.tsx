"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/features/common/components/SubHeader";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import AdminLoadingState from "@/features/admin/common/AdminLoadingState";
import { getLectureListAction } from "@/features/contentmanage/lecture/actions";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { createCouponAction } from "../actions";
import { AdminCouponPayload } from "../types";
import CouponForm from "./CouponForm";

export default function CreateCouponClient() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setCourses(await getLectureListAction());
      } catch (error: unknown) {
        setApiError(error instanceof Error ? error.message : "강의 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCourses();
  }, []);

  const handleCreate = async (data: AdminCouponPayload) => {
    try {
      setApiError("");
      await createCouponAction(data);
      return true;
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : "쿠폰 등록에 실패했습니다.");
      return false;
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="강의 목록을 불러오는 중입니다." />;
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8" aria-labelledby="create-coupon-title">
      <section aria-labelledby="create-coupon-title">
        <SubHeader
          backHref="/contentadmin/coupon"
          backText="쿠폰 목록으로 돌아가기"
          title="쿠폰 등록"
          description="새로운 쿠폰을 등록합니다."
        />
      </section>

      <AdminErrorBanner message={apiError} />

      <section className="mt-6" aria-label="쿠폰 등록 폼">
        <CouponForm courses={courses} isEdit={false} onSubmit={handleCreate} />
      </section>
    </main>
  );
}