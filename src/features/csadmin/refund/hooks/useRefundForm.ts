"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminRefundById,
  rejectRefund,
  requestRefundReview,
} from "@/features/services/adminRefund.service";
import {
  CsRefund,
  CsRefundFormData,
  CsRefundStatus,
  RefundApiStatus,
  getCsNextStatusOptions,
  toRefundFormData,
} from "../types";

const emptyForm: CsRefundFormData = {
  reason: "",
  refundAmount: "0",
  adminMemo: "",
  status: "",
  rejectReason: "",
};

export const useRefundForm = (refundId: number) => {
  const [refund, setRefund] = useState<CsRefund | null>(null);
  const [formData, setFormData] = useState<CsRefundFormData>(emptyForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const fetchRefund = useCallback(async (signal?: AbortSignal) => {
    await Promise.resolve();

    try {
      setIsLoading(true);
      setError("");
      const data = await getAdminRefundById(refundId, signal);

      if (signal?.aborted) return;

      if (!data) {
        setError("환불 요청 정보를 찾을 수 없습니다.");
        return;
      }

      setRefund(data);
      // 처리 상태는 현재 상태가 아니라 "아직 선택 안 함"으로 시작해야 select와 실제로 어긋나지 않습니다.
      setFormData({ ...toRefundFormData(data), status: "" });
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "환불 요청 정보를 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [refundId]);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      await fetchRefund(controller.signal);
    })();

    return () => {
      controller.abort();
    };
  }, [fetchRefund]);

  // CS매니저 화면은 REQUESTED(취소 요청) 단계에서만 액션이 있습니다 — 승인/완료는 정산매니저 담당입니다.
  const nextStatusOptions = refund ? getCsNextStatusOptions(refund.statusCode) : [];

  const updateField = <K extends keyof CsRefundFormData>(
    key: K,
    value: CsRefundFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const applyStatus = (status: CsRefundStatus, statusCode: RefundApiStatus) => {
    setRefund((prev) => (prev ? { ...prev, status, statusCode } : prev));
    setFormData((prev) => ({ ...prev, status }));
  };

  const saveRefund = async () => {
    if (!refund) return;

    try {
      setIsSubmitting(true);
      setError("");

      if (formData.status === "정산 검토중") {
        await requestRefundReview(refund.refundId);
        applyStatus("정산 검토중", "UNDER_REVIEW");
      } else if (formData.status === "반려") {
        if (!formData.rejectReason.trim()) {
          setError("반려 사유를 입력해주세요.");
          return;
        }

        await rejectRefund(refund.refundId, formData.rejectReason.trim());
        applyStatus("반려", "REJECTED");
      } else {
        setError("변경할 처리 상태를 선택해주세요.");
        return;
      }

      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "환불 요청 처리에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    refund,
    formData,
    nextStatusOptions,
    error,
    isLoading,
    isSubmitting,
    confirmOpen,
    completeOpen,
    setConfirmOpen,
    setCompleteOpen,
    updateField,
    saveRefund,
  };
};
