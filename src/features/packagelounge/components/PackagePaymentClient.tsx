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
import { PAYMENT_DUMMY_PASSENGER } from "../payment.data";
import { getPassengerInfo } from "../utils/passengerStorage";
import type { PackageDetailData } from "../packageDetail.types";

interface PackagePaymentClientProps {
  data: PackageDetailData;
  packageId: string;
}

// 패키지 결제 페이지 전체를 조립하는 클라이언트 컴포넌트
// (쿠폰/마일리지/토스페이먼츠 결제 흐름은 기존 결제 기능을 그대로 재사용합니다)
export default function PackagePaymentClient({
  data,
  packageId,
}: PackagePaymentClientProps) {
  // 예약 페이지에서 입력해 둔 탑승객 정보를 불러온다 (없으면 임시 값 사용)
  const [passenger, setPassenger] = useState(PAYMENT_DUMMY_PASSENGER);

  useEffect(() => {
    const saved = getPassengerInfo();
    if (saved) setPassenger(saved);
  }, []);

  const {
    coupons,
    selectedCouponId,
    mileageBalance,
    mileageInputValue,
    usedMileage,
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
  } = usePackagePayment({
    packageId,
    packageName: data.title,
    flightPrice: data.booking.flightPrice,
    accommodationPrice: data.booking.stayPrice,
  });

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
            <SelectedPackage data={data} />
            <PassengerSummary passenger={passenger} packageId={packageId} />
            <CouponSelector
              coupons={coupons}
              selectedCouponId={selectedCouponId}
              onChange={handleCouponChange}
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
                packageId={packageId}
                productAmount={productAmount}
                couponDiscount={couponDiscount}
                usedMileage={usedMileage}
                finalAmount={finalAmount}
                isPaying={isPaying}
                onPay={handlePay}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
