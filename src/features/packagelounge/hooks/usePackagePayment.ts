"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { requestTossPayment } from "@/features/services/portone.service";
import { getCouponDiscount, normalizeMileageInput } from "@/features/payment/utils";
import type { MyCoupon } from "@/features/mypage/benefits/components/types";
import {
  PAYMENT_DUMMY_COUPONS,
  PAYMENT_DUMMY_MILEAGE_BALANCE,
} from "../payment.data";

interface UsePackagePaymentParams {
  packageId: string;
  packageName: string;
  flightPrice: number;
  accommodationPrice: number;
}

// 패키지 결제 페이지의 쿠폰/마일리지/결제 요청 상태를 관리하는 훅
// (쿠폰·마일리지 계산 유틸과 토스페이먼츠 결제 함수는 기존 결제 기능을 그대로 재사용합니다)
export function usePackagePayment({
  packageId,
  packageName,
  flightPrice,
  accommodationPrice,
}: UsePackagePaymentParams) {
  const router = useRouter();
  const [coupons] = useState<MyCoupon[]>(PAYMENT_DUMMY_COUPONS);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [mileageBalance] = useState(PAYMENT_DUMMY_MILEAGE_BALANCE);
  const [mileageInputValue, setMileageInputValue] = useState("");
  const [usedMileage, setUsedMileage] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  const productAmount = flightPrice + accommodationPrice;

  const selectedCoupon = useMemo(
    () =>
      coupons.find((coupon) => coupon.userCouponId === selectedCouponId) ??
      null,
    [coupons, selectedCouponId]
  );

  const couponDiscount = useMemo(
    () => getCouponDiscount(selectedCoupon, productAmount),
    [selectedCoupon, productAmount]
  );

  const maxMileage = useMemo(
    () => Math.min(mileageBalance, Math.max(productAmount - couponDiscount, 0)),
    [mileageBalance, productAmount, couponDiscount]
  );

  const finalAmount = useMemo(
    () => Math.max(productAmount - couponDiscount - usedMileage, 0),
    [productAmount, couponDiscount, usedMileage]
  );

  const handleCouponChange = useCallback((couponId: number | null) => {
    setSelectedCouponId(couponId);
    // 쿠폰이 바뀌면 결제 금액이 바뀌므로 적용된 마일리지 초기화
    setUsedMileage(0);
    setMileageInputValue("");
  }, []);

  const handleMileageInputChange = useCallback((value: string) => {
    setMileageInputValue(value);
  }, []);

  const handleApplyMileage = useCallback(() => {
    const nextMileage = normalizeMileageInput(mileageInputValue, maxMileage);

    setUsedMileage(nextMileage);
    setMileageInputValue(String(nextMileage));
  }, [mileageInputValue, maxMileage]);

  const handleUseAllMileage = useCallback(() => {
    setMileageInputValue(String(maxMileage));
  }, [maxMileage]);

  const handlePay = useCallback(async () => {
    if (isPaying) return;

    setIsPaying(true);
    setErrorMessage("");

    try {
      if (finalAmount > 0) {
        const paymentResult = await requestTossPayment({
          orderName: packageName,
          totalAmount: finalAmount,
        });

        console.log("[package-payment] 토스페이먼츠 결제 결과", {
          packageId,
          paymentResult,
        });
      }

      setPaymentDone(true);
      // 현재 결제 페이지는 항상 전액을 한 번에 결제하므로 "일시불"로 이동한다
      router.push(`/packagelounge/${packageId}/payment/success?mode=full`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "결제 처리에 실패했습니다.";

      setErrorMessage(message);
    } finally {
      setIsPaying(false);
    }
  }, [isPaying, finalAmount, packageName, packageId, router]);

  return {
    coupons,
    selectedCouponId,
    mileageBalance,
    mileageInputValue,
    usedMileage,
    isPaying,
    errorMessage,
    paymentDone,
    productAmount,
    couponDiscount,
    maxMileage,
    finalAmount,
    handleCouponChange,
    handleMileageInputChange,
    handleApplyMileage,
    handleUseAllMileage,
    handlePay,
  };
}
