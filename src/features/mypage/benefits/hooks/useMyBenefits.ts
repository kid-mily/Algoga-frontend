"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  BenefitApiError,
  getMyCoupons,
  getMyMileages,
} from "@/features/services/myBenefit.service";
import {
  MyCoupon,
  MyMileage,
} from "../components/types";

const initialMileage: MyMileage = {
  totalMileage: 0,
  totalEarnedMileage: 0,
  totalUsedMileage: 0,
  histories: [],
};

export function useMyBenefits() {
  const router = useRouter();

  const [coupons, setCoupons] = useState<MyCoupon[]>([]);
  const [mileage, setMileage] = useState<MyMileage>(initialMileage);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMyBenefits = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [couponData, mileageData] = await Promise.all([
        getMyCoupons(),
        getMyMileages(),
      ]);

      setCoupons(couponData);
      setMileage(mileageData);
    } catch (error) {
      console.error("쿠폰 및 마일리지 조회 실패:", error);

      if (error instanceof BenefitApiError) {
        if (error.status === 401 || error.status === 403) {
          router.replace("/auth/login");
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "쿠폰 및 마일리지 정보를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMyBenefits();
  }, [fetchMyBenefits]);

  return {
    coupons,
    mileage,
    isLoading,
    errorMessage,
    refetch: fetchMyBenefits,
  };
}