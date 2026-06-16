"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  approveRefund,
  completeRefund,
  getAdminRefunds,
  rejectRefund,
  requestRefundReview,
} from "@/features/services/adminRefund.service";
import { CsRefund, CsRefundStatus } from "../types";

export const useCsRefundList = (initialRefunds: CsRefund[]) => {
  const [refunds, setRefunds] = useState<CsRefund[]>(initialRefunds);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CsRefundStatus | "ALL">("ALL");
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("처리가 완료되었습니다.");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const inFlightRef = useRef(false);

  const fetchRefunds = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getAdminRefunds(signal);

      if (signal?.aborted) return;

      setRefunds(data);
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

    return refunds.filter((refund) => {
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

  const runRefundAction = async (
    refundId: number,
    action: "review" | "approve" | "reject" | "complete"
  ) => {
    if (inFlightRef.current) return;

    inFlightRef.current = true;

    const actionMap = {
      review: requestRefundReview,
      approve: approveRefund,
      reject: rejectRefund,
      complete: completeRefund,
    };
    const messageMap = {
      review: "환불 검토 요청이 완료되었습니다.",
      approve: "환불 요청이 승인되었습니다.",
      reject: "환불 요청이 반려되었습니다.",
      complete: "환불 처리가 완료되었습니다.",
    };

    try {
      setProcessingId(refundId);
      setError("");
      await actionMap[action](refundId);
      await fetchRefunds();
      setCompleteMessage(messageMap[action]);
      setCompleteOpen(true);
    } catch (actionError: unknown) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "환불 요청 처리에 실패했습니다."
      );
    } finally {
      inFlightRef.current = false;
      setProcessingId(null);
    }
  };

  return {
    searchKeyword,
    selectedStatus,
    filteredRefunds,
    totalCount: refunds.length,
    pendingCount,
    completeOpen,
    completeMessage,
    error,
    isLoading,
    processingId,
    setSearchKeyword,
    setSelectedStatus,
    setCompleteOpen,
    runRefundAction,
  };
};
