"use client";

import { useEffect, useState } from "react";
import { getCouponDetailAction } from "../actions";
import { AdminCouponRecord } from "../types";

export function useAdminCouponDetail(courseId: number, couponId: number) {
  const [coupon, setCoupon] = useState<AdminCouponRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!courseId) {
        setErrorMessage("강의 ID가 없어 쿠폰 정보를 불러올 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getCouponDetailAction(courseId, couponId);
        setCoupon(data);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "쿠폰 정보를 불러오지 못했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (couponId) {
      void fetchCoupon();
    }
  }, [courseId, couponId]);

  return { coupon, isLoading, errorMessage };
}