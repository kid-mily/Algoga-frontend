"use client";

import { useEffect, useState } from "react";
import { getLectureListAction } from "@/features/contentmanage/lecture/actions";
import { AdminCourseRecord } from "@/features/contentmanage/lecture/types";
import { getCouponListAction } from "../actions";
import { CouponWithLecture } from "../types";
import { getCouponId } from "../utils/couponFormatters";

export function useAdminCouponList() {
  const [coupons, setCoupons] = useState<CouponWithLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const courses = await getLectureListAction();
      const couponGroups = await Promise.all(
        courses.map(async (course) => {
          const courseRecord = course as AdminCourseRecord;
          const courseId =
            courseRecord.courseId || courseRecord.course_id || courseRecord.id || 0;

          if (!courseId) return [];

          try {
            const courseCoupons = await getCouponListAction(courseId);
            const mappedCoupons = courseCoupons.map((coupon) => ({
              ...coupon,
              courseId: coupon.courseId || courseId,
              lectureName: course.title || "강의명 없음",
            }));

            return mappedCoupons;
          } catch {
            return [];
          }
        })
      );

      const nextCoupons = couponGroups
        .flat()
        .sort((a, b) => getCouponId(b) - getCouponId(a));

      setCoupons(nextCoupons);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "쿠폰 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCoupons();
  }, []);

  return {
    coupons,
    isLoading,
    errorMessage,
    refetch: fetchCoupons,
    setCoupons,
  };
}

