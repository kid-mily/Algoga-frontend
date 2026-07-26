"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminCouponPolicyPage } from "@/features/services/adminCoupon.service";
import { CouponStatusFilter, CouponWithLecture } from "../types";

const PAGE_SIZE = 10;

export function useAdminCouponList(
  currentPage: number,
  searchTerm: string,
  statusFilter: CouponStatusFilter
) {
  const [coupons, setCoupons] = useState<CouponWithLecture[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getAdminCouponPolicyPage({
        page: currentPage - 1,
        size: PAGE_SIZE,
        keyword: searchTerm.trim() || undefined,
        active:
          statusFilter === "all" ? undefined : statusFilter === "active",
      });
      setCoupons(
        data.content.map((coupon) => ({
          ...coupon,
          lectureName: coupon.courseTitle ?? "강의명 없음",
        }))
      );
      setTotalPages(Math.max(data.totalPages, 1));
      setTotalElements(data.totalElements);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "쿠폰 목록을 불러오지 못했습니다."
      );
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchCoupons(), 250);
    return () => window.clearTimeout(timer);
  }, [fetchCoupons]);

  return {
    coupons,
    totalPages,
    totalElements,
    isLoading,
    errorMessage,
    refetch: fetchCoupons,
  };
}
