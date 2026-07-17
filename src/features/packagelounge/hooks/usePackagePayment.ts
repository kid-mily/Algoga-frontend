"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { requestTossPayment } from "@/features/services/portone.service";
import { createPayment } from "@/features/services/package.service";
import { getMyCoupons, getMyMileages } from "@/features/services/myBenefit.service";
import { createLecturePayment } from "@/features/services/SinglePayment.service";
import { getCouponDiscount, normalizeMileageInput } from "@/features/payment/utils";
import type { MyCoupon } from "@/features/mypage/benefits/components/types";
import { ApiRequestError } from "@/lib/api";

interface UsePackagePaymentParams {
  packageId: string;
  packageName: string;
  bookingId: number;
  // 예약 조회(GET /bookings/{id})로 받은 실제 총 결제 금액 (숙소+항공, 강의 제외)
  totalPrice: number;
  // 강의는 패키지와 백엔드에서 연결돼 있지 않아 별도 결제(POST /payments/lecture)로 처리한다. 없으면 null
  courseId: number | null;
  coursePrice: number;
}

// 백엔드 응답의 errorCode별 안내 문구
const PAYMENT_ERROR_MESSAGE: Record<string, string> = {
  PAY_002: "예약 정보를 찾을 수 없습니다.",
  PAY_003: "결제 금액이 올바르지 않습니다.",
  PAY_004: "이미 처리된 결제입니다.",
  PAY_005: "결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};

// 패키지 결제 페이지의 쿠폰/마일리지/결제 요청 상태를 관리하는 훅
export function usePackagePayment({
  packageId,
  packageName,
  bookingId,
  totalPrice,
  courseId,
  coursePrice,
}: UsePackagePaymentParams) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<MyCoupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [mileageBalance, setMileageBalance] = useState(0);
  const [mileageInputValue, setMileageInputValue] = useState("");
  const [usedMileage, setUsedMileage] = useState(0);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 보유 쿠폰 전체(사용 가능한 것)와 마일리지 잔액을 조회한다 
  useEffect(() => {
    let active = true;

    const loadBenefits = async () => {
      const [couponResult, mileageResult] = await Promise.allSettled([
        getMyCoupons(),
        getMyMileages(),
      ]);

      if (!active) return;

      if (couponResult.status === "fulfilled") {
        setCoupons(
          couponResult.value.filter(
            (coupon) => coupon.status === "ISSUED" && coupon.usable
          )
        );
      } else {
        console.error("[packagelounge] 쿠폰 조회 실패:", couponResult.reason);
      }

      if (mileageResult.status === "fulfilled") {
        setMileageBalance(mileageResult.value.totalMileage ?? 0);
      } else {
        console.error("[packagelounge] 마일리지 조회 실패:", mileageResult.reason);
      }

      setIsLoadingBenefits(false);
    };

    void loadBenefits();

    return () => {
      active = false;
    };
  }, []);

  // 패키지(숙소+항공) 금액에 강의 금액을 합쳐서 하나의 결제 금액으로 보여준다.
  // 강의와 패키지는 백엔드에서 서로 연결돼 있지 않아, 실제 결제는 아래 handlePay에서 두 API로 나눠 호출한다.
  const productAmount = totalPrice + coursePrice;

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

    const discountTotal = couponDiscount + usedMileage;
    const packageDiscount = Math.min(discountTotal, totalPrice);
    const packageAmount = totalPrice - packageDiscount;
    const lectureAmount = Math.max(coursePrice - (discountTotal - packageDiscount), 0);

    let packagePaid = false;

    try {
      let portonePaymentId = "";

      if (finalAmount > 0) {
        portonePaymentId = await requestTossPayment({
          orderName: packageName,
          totalAmount: finalAmount,
        });
      }

      await createPayment({
        bookingId,
        paymentType: "FULL",
        amount: packageAmount,
        usedMileage,
        usedCouponId: selectedCouponId,
        portonePaymentId,
      });
      packagePaid = true;

      if (courseId) {
        try {
          await createLecturePayment({
            courseId,
            amount: lectureAmount,
            usedMileage: 0,
            usedCouponId: null,
            portonePaymentId,
          });
        } catch (lectureError) {
          console.error("[packagelounge] 강의 결제 실패:", lectureError);
          setErrorMessage(
            "패키지 결제는 완료됐지만 강의 결제 처리에 실패했습니다. 고객센터로 문의해 주세요."
          );
          return;
        }
      }

      // 현재 결제 페이지는 항상 전액을 한 번에 결제하므로 "일시불"로 이동한다
      router.push(`/packagelounge/${packageId}/payment/success?mode=full`);
    } catch (error) {
      if (packagePaid) return;

      if (error instanceof ApiRequestError) {
        const errorCode = (error.body as { errorCode?: string } | null)
          ?.errorCode;
        setErrorMessage(
          (errorCode && PAYMENT_ERROR_MESSAGE[errorCode]) ||
            error.message ||
            "결제 처리에 실패했습니다."
        );
      } else {
        const message =
          error instanceof Error ? error.message : "결제 처리에 실패했습니다.";
        setErrorMessage(message);
      }
    } finally {
      setIsPaying(false);
    }
  }, [
    isPaying,
    finalAmount,
    couponDiscount,
    usedMileage,
    totalPrice,
    coursePrice,
    courseId,
    packageName,
    packageId,
    bookingId,
    selectedCouponId,
    router,
  ]);

  return {
    coupons,
    selectedCouponId,
    mileageBalance,
    mileageInputValue,
    usedMileage,
    isLoadingBenefits,
    isPaying,
    errorMessage,
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
