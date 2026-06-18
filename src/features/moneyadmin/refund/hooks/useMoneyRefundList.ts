import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { getAdminRefunds } from "@/features/services/adminRefund.service";
import { MoneyRefund, MoneyRefundStatus } from "../types";
import { formatRefundError } from "../utils";

export const useMoneyRefundList = (
  initialRefunds: MoneyRefund[] = [],
  hasInitialData = false
) => {
  const [refunds, setRefunds] = useState<MoneyRefund[]>(initialRefunds);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MoneyRefundStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const deferredSearchKeyword = useDeferredValue(searchKeyword);

  const loadRefunds = useCallback(async (signal?: AbortSignal) => {
    const data = await getAdminRefunds({ signal });

    if (signal?.aborted) return;
    setRefunds(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (hasInitialData) return;

      try {
        setIsLoading(true);
        setError("");
        await loadRefunds(controller.signal);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setError(formatRefundError(loadError, "환불 요청 목록을 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [hasInitialData, loadRefunds]);

  const filteredRefunds = useMemo(() => {
    const keyword = deferredSearchKeyword.trim().toLowerCase();

    return refunds.filter((refund) => {
      const matchesStatus =
        selectedStatus === "ALL" || refund.status === selectedStatus;
      const matchesKeyword =
        !keyword ||
        [
          refund.id,
          refund.bookingId,
          refund.user,
          refund.product,
          String(refund.paymentId),
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [deferredSearchKeyword, refunds, selectedStatus]);

  const waitingCount = useMemo(
    () =>
      refunds.filter(
        (refund) => refund.status === "취소 요청" || refund.status === "정산 검토중"
      ).length,
    [refunds]
  );

  const approvedCount = useMemo(
    () => refunds.filter((refund) => refund.status === "환불 승인").length,
    [refunds]
  );

  return {
    refunds,
    filteredRefunds,
    totalCount: refunds.length,
    filteredCount: filteredRefunds.length,
    waitingCount,
    approvedCount,
    searchKeyword,
    selectedStatus,
    isLoading,
    error,
    setSearchKeyword,
    setSelectedStatus,
    setError,
    loadRefunds,
  };
};
