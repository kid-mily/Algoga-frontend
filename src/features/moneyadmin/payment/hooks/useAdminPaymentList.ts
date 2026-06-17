"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAdminPayments } from "@/features/services/adminPayment.service";
import { AdminPayment, PaymentStatus, PaymentType } from "../types";
import { formatPaymentError, getDefaultPaymentDateRange } from "../utils";

export const useAdminPaymentList = (initialPayments: AdminPayment[] = []) => {
  const defaultDateRange = getDefaultPaymentDateRange();
  const [payments, setPayments] = useState<AdminPayment[]>(initialPayments);
  const [fromDate, setFromDate] = useState(defaultDateRange.from);
  const [toDate, setToDate] = useState(defaultDateRange.to);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "ALL">(
    "ALL"
  );
  const [selectedType, setSelectedType] = useState<PaymentType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAdminPayments({
          from: fromDate,
          to: toDate,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setPayments(data);
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(
          formatPaymentError(fetchError, "결제 내역을 불러오지 못했습니다.")
        );
        setPayments([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchPayments();

    return () => {
      controller.abort();
    };
  }, [fromDate, toDate]);

  const filteredPayments = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesKeyword =
        !keyword ||
        [
          payment.displayId,
          payment.userName,
          payment.productName,
          payment.paymentMethod,
          payment.portonePaymentId,
          String(payment.paymentId),
          String(payment.bookingId ?? ""),
          String(payment.courseId ?? ""),
          String(payment.userId),
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesStatus =
        selectedStatus === "ALL" || payment.status === selectedStatus;
      const matchesType =
        selectedType === "ALL" || payment.paymentType === selectedType;

      return matchesKeyword && matchesStatus && matchesType;
    });
  }, [payments, searchKeyword, selectedStatus, selectedType]);

  const totalAmount = useMemo(
    () => filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
    [filteredPayments]
  );

  const successCount = payments.filter(
    (payment) => payment.status === "SUCCESS"
  ).length;

  return {
    payments,
    filteredPayments,
    totalCount: payments.length,
    filteredCount: filteredPayments.length,
    successCount,
    totalAmount,
    searchKeyword,
    fromDate,
    toDate,
    selectedStatus,
    selectedType,
    isLoading,
    error,
    setSearchKeyword,
    setFromDate,
    setToDate,
    setSelectedStatus,
    setSelectedType,
    setError,
  };
};
