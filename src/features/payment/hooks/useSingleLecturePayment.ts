"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { requestTossPayment } from "@/features/services/portone.service";
import { getCourseStudyDetail } from "@/features/services/courseStudy.service";
import {
  createLecturePayment,
  LecturePaymentError,
} from "@/features/services/SinglePayment.service";
import type { CourseItem } from "@/features/classroom/components/types";
import type { MyCoupon } from "@/features/mypage/benefits/components/types";
import {
  createSinglePaymentPayload,
  loadSinglePaymentBenefits,
} from "../actions";
import { getCouponDiscount, normalizeMileageInput } from "../utils";

interface Params {
  continentCode: string;
  countryId: string;
  courseId: number;
  course: CourseItem;
}

export function useSingleLecturePayment({
  continentCode,
  countryId,
  courseId,
  course,
}: Params) {
  const router = useRouter();

  const [coupons, setCoupons] = useState<MyCoupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [mileageBalance, setMileageBalance] = useState(0);
  const [usedMileage, setUsedMileage] = useState(0);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const completeUrl = `/classroom/${continentCode}/${countryId}/lecture/${courseId}/payment/single/complete`;

  useEffect(() => {
    let isActive = true;

    const loadBenefits = async () => {
      try {
        setIsLoadingBenefits(true);

        try {
          await getCourseStudyDetail(courseId);

          if (!isActive) return;
          router.replace(completeUrl);
          return;
        } catch (error) {
          if (!isActive) return;

          if (error instanceof ApiRequestError) {
            if (error.status === 401) {
              router.replace("/auth/login");
              return;
            }

            if (error.status !== 403 && error.status !== 404) {
              console.error("[single-payment] 수강 권한 사전 확인 실패", error);
            }
          } else {
            console.error("[single-payment] 수강 권한 사전 확인 실패", error);
          }
        }

        const benefits = await loadSinglePaymentBenefits(courseId);

        if (!isActive) return;

        setCoupons(benefits.coupons);
        setMileageBalance(benefits.mileageBalance);
      } catch (error) {
        if (!isActive) return;
        console.error("[single-payment] 혜택 정보 조회 실패", error);
      } finally {
        if (isActive) {
          setIsLoadingBenefits(false);
        }
      }
    };

    loadBenefits();

    return () => {
      isActive = false;
    };
  }, [courseId, completeUrl, router]);

  const selectedCoupon = useMemo(() => {
    return (
      coupons.find((coupon) => coupon.userCouponId === selectedCouponId) ?? null
    );
  }, [coupons, selectedCouponId]);

  const price = Number(course.price ?? 0);

  const couponDiscount = useMemo(
    () => getCouponDiscount(selectedCoupon, price),
    [selectedCoupon, price]
  );

  const maxMileage = useMemo(
    () => Math.min(mileageBalance, Math.max(price - couponDiscount, 0)),
    [mileageBalance, price, couponDiscount]
  );

  const finalAmount = useMemo(
    () => Math.max(price - couponDiscount - usedMileage, 0),
    [price, couponDiscount, usedMileage]
  );

  const handleCouponChange = useCallback((couponId: number | null) => {
    setSelectedCouponId(couponId);
    setUsedMileage(0);
  }, []);

  const handleMileageChange = useCallback(
    (value: string) => {
      setUsedMileage(normalizeMileageInput(value, maxMileage));
    },
    [maxMileage]
  );

  const handlePay = useCallback(async () => {
    if (isPaying) return;

    if (!Number.isFinite(finalAmount) || finalAmount < 0) {
      setErrorMessage("결제 금액을 확인해 주세요.");
      return;
    }

    let paymentCreated = false;

    try {
      setIsPaying(true);
      setErrorMessage("");

      console.log("[single-payment] 결제 시작", {
        courseId,
        courseTitle: course.title,
        price,
        couponDiscount,
        usedMileage,
        finalAmount,
        selectedCouponId,
      });

      let portonePaymentId: string | null = null;

      if (finalAmount > 0) {
        const paymentResult = await requestTossPayment({
          orderName: course.title,
          totalAmount: finalAmount,
        });

        console.log("[single-payment] 포트원 결제 결과", paymentResult);

        if (!paymentResult) {
          throw new Error("PAY_PROCESS_CANCELED");
        }

        portonePaymentId =
          typeof paymentResult === "string"
            ? paymentResult
            : paymentResult.paymentId ?? paymentResult.portonePaymentId ?? null;

        if (!portonePaymentId) {
          throw new Error("결제 ID를 받아오지 못했습니다.");
        }
      }

      const payload = createSinglePaymentPayload({
        courseId,
        finalAmount,
        usedMileage,
        selectedCouponId,
        portonePaymentId,
      });

      console.log("[single-payment] 백엔드 결제 승인 요청", payload);

      const paymentResponse = await createLecturePayment(payload);
      paymentCreated = true;

      console.log("[single-payment] 백엔드 결제 승인 성공", paymentResponse);

      router.push(completeUrl);
    } catch (error) {
      console.error("[single-payment] 결제 처리 실패", error);

      if (paymentCreated) {
        setErrorMessage(
          "결제는 완료되었지만 완료 페이지로 이동하지 못했습니다. 강의실에서 결제 상태를 확인해 주세요."
        );
        return;
      }

      if (error instanceof LecturePaymentError) {
        console.error("[single-payment] 백엔드 결제 오류 상세", {
          status: error.status,
          code: error.code,
          traceId: error.traceId,
          responseData: error.responseData,
        });

        if (error.status === 409) {
          console.warn(
            "[single-payment] 이미 처리된 결제입니다. 완료 페이지로 이동합니다.",
            error.responseData
          );

          router.push(completeUrl);
          return;
        }

        if (error.status === 401 || error.status === 403) {
          setErrorMessage(
            "로그인이 필요합니다. 로그인 후 다시 결제해 주세요."
          );
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      const message =
        error instanceof Error ? error.message : "결제 처리에 실패했습니다.";

      if (message.includes("CANCELED") || message.includes("취소")) {
        setErrorMessage("결제가 취소되었습니다.");
        return;
      }

      setErrorMessage(message);
    } finally {
      if (!paymentCreated) {
        setIsPaying(false);
      }
    }
  }, [
    isPaying,
    finalAmount,
    course.title,
    courseId,
    price,
    couponDiscount,
    usedMileage,
    selectedCouponId,
    router,
    completeUrl,
  ]);

  return {
    coupons,
    selectedCouponId,
    mileageBalance,
    usedMileage,
    isLoadingBenefits,
    isPaying,
    errorMessage,
    price,
    couponDiscount,
    maxMileage,
    finalAmount,
    handleCouponChange,
    handleMileageChange,
    handlePay,
    handleBack: router.back,
  };
}
