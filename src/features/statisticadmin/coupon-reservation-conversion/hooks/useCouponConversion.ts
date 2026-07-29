"use client";

import { useEffect, useState } from "react";
import {
  CouponConversionData,
  getCouponConversionData,
} from "@/features/services/adminCouponConversionStatistics.service";
import { ApiRequestError } from "@/lib/api";

export const useCouponConversion = () => {
  const [data, setData] = useState<CouponConversionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getCouponConversionData(controller.signal);

        if (controller.signal.aborted) return;
        setData(result);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setData(null);
        setError(
          loadError instanceof ApiRequestError
            ? loadError.message
            : "쿠폰 → 예약 전환 현황을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  return { data, isLoading, error };
};
