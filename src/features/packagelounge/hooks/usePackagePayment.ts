"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { requestTossPayment } from "@/features/services/portone.service";
import {
  createBundlePayment,
  createPayment,
  getBundlePaymentPreview,
} from "@/features/services/package.service";
import { getMyCoupons, getMyMileages } from "@/features/services/myBenefit.service";
import { getCouponDiscount, normalizeMileageInput } from "@/features/payment/utils";
import type { MyCoupon } from "@/features/mypage/benefits/components/types";
import { ApiRequestError } from "@/lib/api";

interface UsePackagePaymentParams {
  packageId: string;
  packageName: string;
  bookingId: number;
  // 예약 조회(GET /bookings/{id})로 받은 실제 총 결제 금액 (숙소+항공, 강의 제외)
  totalPrice: number;
  // 예약금(전체의 30%). paymentType이 DEPOSIT일 때 패키지분으로 사용
  depositPrice: number;
  // false면 예약금 분할 결제 불가, FULL만 가능 (완강 후 예약 등)
  installmentAllowed: boolean;
  // 강의는 패키지와 백엔드에서 연결돼 있지 않아 별도 결제(POST /payments/lecture)로 처리한다. 없으면 null
  courseId: number | null;
  coursePrice: number;
  courseName: string | null;
}

// 백엔드 응답의 errorCode별 안내 문구
const PAYMENT_ERROR_MESSAGE: Record<string, string> = {
  PAY_002: "예약 정보를 찾을 수 없습니다.",
  PAY_003: "결제 금액이 올바르지 않습니다.",
  PAY_004: "이미 처리된 결제입니다.",
  PAY_005: "결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  PAY_007: "강의 정보를 찾을 수 없습니다.",
  PAY_015: "이 예약은 일시불(전액) 결제만 가능합니다.",
  PAY_016: "통합 결제는 예약금 또는 일시불만 가능합니다.",
  // 2026-07-22 백엔드 추가 — 출발일이 지난 예약의 결제(단건/통합 모두) 최종 차단
  BK_005: "출발일이 지나 예약·결제할 수 없습니다.",
  BK_006: "출발 7일 전 잔금 결제가 마감되었습니다.",
};

// 패키지 결제 페이지의 쿠폰/마일리지/결제 요청 상태를 관리하는 훅
export function usePackagePayment({
  packageId,
  packageName,
  bookingId,
  totalPrice,
  depositPrice,
  installmentAllowed,
  courseId,
  coursePrice,
  courseName,
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
  // FULL: 일시불(전액) / DEPOSIT: 예약금(30%)만 먼저 결제. installmentAllowed가 false면 FULL 고정
  const [paymentType, setPaymentType] = useState<"FULL" | "DEPOSIT">("FULL");

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

  // 패키지분: paymentType이 DEPOSIT이면 예약금(30%), FULL이면 전액. 강의는 분할 없이 항상 정가 전액
  const packageAmount = paymentType === "DEPOSIT" ? depositPrice : totalPrice;
  // 화면 표시용 상품 금액(패키지분 + 강의). 쿠폰/마일리지 차감 전 금액
  const productAmount = packageAmount + coursePrice;

  // 2026-07-23 정책 확정 — 1차(예약금, DEPOSIT)는 마일리지만 사용 가능, 쿠폰은 일시불(FULL)에서만 사용 가능
  const isCouponAllowed = paymentType === "FULL";

  const selectedCoupon = useMemo(
    () =>
      coupons.find((coupon) => coupon.userCouponId === selectedCouponId) ??
      null,
    [coupons, selectedCouponId]
  );

  // 쿠폰/마일리지는 이제 패키지분+강의를 합친 전체 금액(productAmount)에 적용한다.
  // DEPOSIT(1차)는 쿠폰 자체를 못 쓰므로 할인 0
  const couponDiscount = useMemo(
    () => (isCouponAllowed ? getCouponDiscount(selectedCoupon, productAmount) : 0),
    [isCouponAllowed, selectedCoupon, productAmount]
  );

  const maxMileage = useMemo(
    () => Math.min(mileageBalance, Math.max(productAmount - couponDiscount, 0)),
    [mileageBalance, productAmount, couponDiscount]
  );

  const finalAmount = useMemo(
    () => Math.max(productAmount - couponDiscount - usedMileage, 0),
    [productAmount, couponDiscount, usedMileage]
  );

  const handleCouponChange = useCallback(
    (couponId: number | null) => {
      if (!isCouponAllowed) return;

      setSelectedCouponId(couponId);
      // 쿠폰이 바뀌면 결제 금액이 바뀌므로 적용된 마일리지 초기화
      setUsedMileage(0);
      setMileageInputValue("");
    },
    [isCouponAllowed]
  );

  const handlePaymentTypeChange = useCallback(
    (nextType: "FULL" | "DEPOSIT") => {
      if (nextType === "DEPOSIT" && !installmentAllowed) return;

      setPaymentType(nextType);
      // 패키지분 금액이 바뀌므로 적용된 마일리지 초기화 (쿠폰 할인은 재계산됨)
      setUsedMileage(0);
      setMileageInputValue("");
      // DEPOSIT(1차)는 쿠폰을 못 쓰므로 선택돼 있던 쿠폰도 같이 해제
      if (nextType === "DEPOSIT") {
        setSelectedCouponId(null);
      }
    },
    [installmentAllowed]
  );

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
      // 강의가 있으면 결제창을 띄우기 전에 통합결제 사전 검증(GET /payments/bundle/preview)부터 한다.
      // 이미 결제한 강의가 껴 있으면(DUPLICATE_PAYMENT) 그 강의를 빼고 패키지만 결제하는 걸로 자동 전환하고,
      // 그 외 사유로 막히면 결제창 자체를 띄우지 않는다
      let useBundle = Boolean(courseId);
      let paymentAmount = finalAmount;

      if (useBundle && courseId) {
        const preview = await getBundlePaymentPreview({
          bookingId,
          courseIds: [courseId],
          paymentType,
          usedMileage,
          usedCouponId: selectedCouponId,
        });

        if (!preview.payable) {
          if (
            preview.blockReason === "DUPLICATE_PAYMENT" &&
            preview.alreadyPaidCourseIds.includes(courseId)
          ) {
            useBundle = false;
            const packagePreview = await getBundlePaymentPreview({
              bookingId,
              paymentType,
              usedMileage,
              usedCouponId: selectedCouponId,
            });

            if (!packagePreview.payable) {
              setErrorMessage(
                packagePreview.blockMessage || "결제를 진행할 수 없습니다."
              );
              return;
            }

            paymentAmount = packagePreview.expectedTotal;
          } else {
            setErrorMessage(preview.blockMessage || "결제를 진행할 수 없습니다.");
            return;
          }
        } else {
          // amount는 반드시 preview의 expectedTotal을 그대로 써야 한다 (직접 계산하면 1원 오차로 거부될 수 있음)
          paymentAmount = preview.expectedTotal;
        }
      }

      let portonePaymentId = "";

      if (paymentAmount > 0) {
        portonePaymentId = await requestTossPayment({
          orderName:
            useBundle && courseId
              ? `${packageName} + ${courseName ?? "강의"}`
              : packageName,
          totalAmount: paymentAmount,
        });
      }

      if (useBundle && courseId) {
        await createBundlePayment({
          bookingId,
          courseIds: [courseId],
          paymentType,
          amount: paymentAmount,
          usedMileage,
          usedCouponId: selectedCouponId,
          portonePaymentId,
        });
      } else {
        await createPayment({
          bookingId,
          paymentType,
          amount: paymentAmount,
          usedMileage,
          usedCouponId: selectedCouponId,
          portonePaymentId,
        });
      }

      // 실제로 결제창에 띄웠던 금액(paymentAmount)과 bookingId를 완료 페이지까지 그대로 넘긴다.
      // (완료 페이지가 패키지 카탈로그 가격을 다시 조회해서 "강의 빠진 금액"을 보여주던 버그 수정)
      // courseId는 이번 결제에 실제로 강의가 포함된 경우(useBundle)에만 넘긴다 —
      // 이미 결제한 강의라 제외되고 패키지만 결제된 경우는 넘기지 않는다
      const successParams = new URLSearchParams({
        mode: paymentType === "DEPOSIT" ? "deposit" : "full",
        bookingId: String(bookingId),
        amount: String(paymentAmount),
      });
      if (useBundle && courseId) {
        successParams.set("courseId", String(courseId));
      }

      router.push(
        `/packagelounge/${packageId}/payment/success?${successParams.toString()}`
      );
    } catch (error) {
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
    courseId,
    courseName,
    packageName,
    packageId,
    bookingId,
    paymentType,
    usedMileage,
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
    paymentType,
    productAmount,
    isCouponAllowed,
    couponDiscount,
    maxMileage,
    finalAmount,
    handleCouponChange,
    handleMileageInputChange,
    handleApplyMileage,
    handleUseAllMileage,
    handlePaymentTypeChange,
    handlePay,
  };
}
