"use client";

import SubHeader from "@/features/common/components/SubHeader";
import CourseInfoCard from "@/features/payment/CourseInfoCard";
import CouponSelector from "@/features/payment/CouponSelector";
import MileageInput from "@/features/payment/MileageInput";
import PaymentSummary from "@/features/payment/PaymentSummary";
import { PaymentButtons } from "@/features/payment/PaymentButton";
import { useSingleLecturePayment } from "./hooks/useSingleLecturePayment";
import { SingleLecturePaymentClientProps } from "./types";

export default function SingleLecturePaymentClient({
  continentCode,
  countryId,
  courseId,
  initialCourse,
}: SingleLecturePaymentClientProps) {
  const {
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
    handleBack,
  } = useSingleLecturePayment({
    continentCode,
    countryId,
    courseId,
    course: initialCourse,
  });

  return (
    <main className="min-h-screen bg-[#f5f6f8] px-4 py-12">
      <section className="mx-auto max-w-3xl space-y-5">
        <SubHeader
          backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
          backText="강의로 돌아가기"
          title="결제하기"
          description="쿠폰과 마일리지를 적용한 뒤 결제를 진행해 주세요."
        />

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm"
          >
            <h2 className="mb-1 font-bold text-red-800">
              결제에 실패했습니다
            </h2>

            <p className="whitespace-pre-line text-gray-700">
              {errorMessage}
            </p>

            <p className="mt-2 text-xs font-medium text-red-500">
              자세한 오류 정보는 브라우저 콘솔을 확인해 주세요.
            </p>
          </div>
        )}

        <CourseInfoCard
          title={initialCourse.title}
          description={initialCourse.description}
          price={price}
        />

        <CouponSelector
          coupons={coupons}
          selectedCouponId={selectedCouponId}
          onChange={handleCouponChange}
        />

        <MileageInput
          mileageBalance={mileageBalance}
          maxMileage={maxMileage}
          usedMileage={usedMileage}
          onChange={handleMileageChange}
        />

        <PaymentSummary
          price={price}
          couponDiscount={couponDiscount}
          usedMileage={usedMileage}
          finalAmount={finalAmount}
        />

        <PaymentButtons
          finalAmount={finalAmount}
          isPaying={isPaying || isLoadingBenefits}
          onBack={handleBack}
          onPay={handlePay}
        />
      </section>
    </main>
  );
}