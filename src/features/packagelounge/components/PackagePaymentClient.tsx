"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CouponSelector from "@/features/payment/CouponSelector";
import MileageInput from "@/features/payment/MileageInput";
import SelectedPackage from "./SelectedPackage";
import PassengerSummary from "./PassengerSummary";
import PaymentSummary from "./PaymentSummary";
import { usePackagePayment } from "../hooks/usePackagePayment";
import { getPassengerInfo } from "../utils/passengerStorage";
import { getBookingDetail } from "@/features/services/package.service";
import { PackageDetailData } from "../packageDetail.types";
import { BookingDetail } from "../types";
import type { PassengerFormData } from "../booking.types";
import { CourseItem } from "@/features/classroom/components/types";

interface PackagePaymentClientProps {
  data: PackageDetailData;
  // 예약 조회는 로그인 유저 전용 데이터라 서버가 아니라
  // 여기(클라이언트)에서 bookingId로 직접 불러온다 (브라우저 쿠키가 자동으로 실리도록)
  bookingId: string;
  packageId: string;
  course: CourseItem | null;
}

// 패키지 결제 페이지 전체를 조립하는 클라이언트 컴포넌트
export default function PackagePaymentClient({
  data,
  bookingId,
  packageId,
  course,
}: PackagePaymentClientProps) {
  // 예약 페이지에서 입력해 둔 탑승객 정보를 불러온다
  const [passenger, setPassenger] = useState<PassengerFormData | null>(null);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");

  useEffect(() => {
    const saved = getPassengerInfo();
    if (saved) setPassenger(saved);
  }, []);

  useEffect(() => {
    let active = true;

    const loadBooking = async () => {
      try {
        const result = await getBookingDetail(bookingId);
        if (active) setBooking(result);
      } catch (error) {
        if (!active) return;

        console.error("[packagelounge] 결제 페이지 예약 조회 실패:", error);
        setLoadErrorMessage(
          "예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
    };

    void loadBooking();

    return () => {
      active = false;
    };
  }, [bookingId]);

  const {
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
  } = usePackagePayment({
    packageId,
    packageName: data.title,
    bookingId: booking?.bookingId ?? 0,
    totalPrice: booking?.totalPrice ?? 0,
    depositPrice: booking?.depositPrice ?? 0,
    installmentAllowed: booking?.installmentAllowed ?? false,
    courseId: course?.courseId ?? null,
    coursePrice: course?.price ?? 0,
    courseName: course?.title ?? null,
  });

  if (loadErrorMessage) {
    return (
      <main className="min-h-screen bg-[#F3F8FC] px-4 py-16">
        <section className="mx-auto max-w-[520px] rounded-[20px] border border-[#E1E8EF] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#172235]">
            {loadErrorMessage}
          </p>
        </section>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#F3F8FC] px-4 py-16">
        <section className="mx-auto max-w-[520px] rounded-[20px] border border-[#E1E8EF] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[#172235]">
            예약 정보를 불러오는 중입니다.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href={`/packagelounge/${packageId}/booking`}
          className="inline-flex items-center gap-2 text-sm text-[#718096] hover:text-[#0A1628]"
        >
          <Image src="/images/arrow.svg" alt="" width={16} height={16} />
          뒤로가기
        </Link>

        <div className="mt-4">
          <span className="text-xs font-bold tracking-[0.16em] text-[#439A97]">
            PAYMENT
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
            결제 정보를 확인해 주세요
          </h1>
          <p className="mt-2 text-sm text-[#718096]">
            선택한 패키지와 예약 정보를 확인한 뒤 결제를 진행합니다.
          </p>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B54747]">
            {errorMessage}
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽: 선택한 패키지 → 탑승객 정보 → 쿠폰 → 마일리지 */}
          <div className="space-y-6 lg:col-span-2">
            <SelectedPackage data={data} course={course} />
            {passenger && (
              <PassengerSummary passenger={passenger} packageId={packageId} />
            )}
            <CouponSelector
              coupons={coupons}
              selectedCouponId={selectedCouponId}
              onChange={handleCouponChange}
              disabled={!isCouponAllowed}
              disabledReason="예약금(1차) 결제는 마일리지만 사용할 수 있어요. 쿠폰은 잔금(2차) 결제 시 사용해 주세요."
            />
            <MileageInput
              mileageBalance={mileageBalance}
              maxMileage={maxMileage}
              mileageInputValue={mileageInputValue}
              usedMileage={usedMileage}
              onChange={handleMileageInputChange}
              onApply={handleApplyMileage}
              onUseAll={handleUseAllMileage}
            />
          </div>

          {/* 오른쪽: 예약 정보 + 요금 상세 + 결제 버튼 */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <PaymentSummary
                data={data}
                course={course}
                paymentType={paymentType}
                installmentAllowed={booking.installmentAllowed}
                onPaymentTypeChange={handlePaymentTypeChange}
                productAmount={productAmount}
                couponDiscount={couponDiscount}
                usedMileage={usedMileage}
                finalAmount={finalAmount}
                balanceAmount={booking.balancePrice}
                isPaying={isPaying || isLoadingBenefits}
                onPay={handlePay}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
