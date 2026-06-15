"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveRefund,
  completeRefund,
  getAdminRefundById,
  rejectRefund,
  requestRefundReview,
} from "@/features/services/adminRefund.service";
import { CsRefund, CsRefundFormData, toRefundFormData } from "../types";

type RefundFormMode = "create" | "edit";

const emptyForm: CsRefundFormData = {
  reason: "",
  refundAmount: "0",
  adminMemo: "",
  status: "정산 검토중",
  rejectReason: "",
};

export const useRefundForm = (refundId: number, mode: RefundFormMode) => {
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
      setFormData(toRefundFormData(data));
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

  const updateField = <K extends keyof CsRefundFormData>(
    key: K,
    value: CsRefundFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const saveRefund = async () => {
    if (!refund) return;

    try {
      setIsSubmitting(true);
      setError("");

      if (mode === "create") {
        await requestRefundReview(refund.refundId);
      } else if (formData.status === "환불 승인") {
        await approveRefund(refund.refundId);
      } else if (formData.status === "반려") {
        await rejectRefund(refund.refundId);
      } else if (formData.status === "환불 완료") {
        await completeRefund(refund.refundId);
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
