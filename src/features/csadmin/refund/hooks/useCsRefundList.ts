"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminRefunds } from "@/features/services/adminRefund.service";
import {
  CsRefund,
  CsRefundStatus,
  sortRefundsByRequestedAtDesc,
} from "../types";

export const useCsRefundList = (initialRefunds: CsRefund[]) => {
  const [refunds, setRefunds] = useState<CsRefund[]>(initialRefunds);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CsRefundStatus | "ALL">("ALL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRefunds = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getAdminRefunds({ signal });

      if (signal?.aborted) return;

      setRefunds(sortRefundsByRequestedAtDesc(data));
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "환불 요청 목록을 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void fetchRefunds(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchRefunds]);

  const filteredRefunds = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return sortRefundsByRequestedAtDesc(refunds).filter((refund) => {
      const statusMatched =
        selectedStatus === "ALL" || refund.status === selectedStatus;
      const keywordMatched =
        !keyword ||
        refund.id.toLowerCase().includes(keyword) ||
        refund.bookingId.toLowerCase().includes(keyword) ||
        refund.user.toLowerCase().includes(keyword) ||
        refund.product.toLowerCase().includes(keyword);

      return statusMatched && keywordMatched;
    });
  }, [refunds, searchKeyword, selectedStatus]);

  const pendingCount = useMemo(
    () => refunds.filter((refund) => refund.status === "취소 요청").length,
    [refunds]
  );

  return {
    searchKeyword,
    selectedStatus,
    filteredRefunds,
    totalCount: refunds.length,
    pendingCount,
    error,
    isLoading,
    setSearchKeyword,
    setSelectedStatus,
  };
};
