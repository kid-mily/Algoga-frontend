"use client";

import { getCountryTicketStyle } from "@/features/classroom/components/countryTicketStyle";
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
  const style = getCountryTicketStyle(continentCode);

  const {
    coupons,
    selectedCouponId,
    mileageBalance,
    mileageInputValue,
    usedMileage,
    isLoadingBenefits,
    isPaying,
    errorMessage,
    price,
    couponDiscount,
    maxMileage,
    finalAmount,
    handleCouponChange,
    handleMileageInputChange,
    handleApplyMileage,
    handleUseAllMileage,
    handlePay,
    handleBack,
  } = useSingleLecturePayment({
    continentCode,
    countryId,
    courseId,
    course: initialCourse,
  });

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-5xl">
        <section className="mt-5 rounded-2xl border border-[#E1E8EF] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(55,88,110,0.06)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-xs font-bold tracking-[0.16em] ${style.text}`}>
                PAYMENT
              </p>
              <h1 className="mt-2 text-2xl font-bold text-[#0A1628]">
                결제 정보를 확인해 주세요
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718096]">
                선택한 강의, 할인 혜택, 최종 결제 금액을 확인한 뒤 결제를 진행합니다.
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm"
            >
              <p className="font-bold text-red-700">결제를 진행할 수 없습니다.</p>
              <p className="mt-1 whitespace-pre-line text-red-600">
                {errorMessage}
              </p>
            </div>
          ) : null}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
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
              mileageInputValue={mileageInputValue}
              usedMileage={usedMileage}
              onChange={handleMileageInputChange}
              onApply={handleApplyMileage}
              onUseAll={handleUseAllMileage}
            />
          </div>

          <aside className="space-y-5 lg:self-start">
            <PaymentSummary
              price={price}
              couponDiscount={couponDiscount}
              usedMileage={usedMileage}
              finalAmount={finalAmount}
              continentCode={continentCode}
            />

            <PaymentButtons
              finalAmount={finalAmount}
              isPaying={isPaying || isLoadingBenefits}
              onBack={handleBack}
              onPay={handlePay}
              continentCode={continentCode}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}