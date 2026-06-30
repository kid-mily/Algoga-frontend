"use client";

import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import MyBenefitsContent from "@/features/mypage/benefits/components/MyBenefitsContent";
import { useMyBenefits } from "@/features/mypage/benefits/hooks/useMyBenefits";

export default function MyBenefitsPage() {
  const {
    coupons,
    mileage,
    isLoading,
    errorMessage,
    refetch,
  } = useMyBenefits();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-[#0A1628]">
          혜택 정보를 불러올 수 없습니다.
        </h1>

        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>

        <button
          type="button"
          onClick={refetch}
          className="mt-5 rounded-xl bg-[#439A97] px-5 py-2 text-sm font-bold text-white hover:bg-[#357F7C]"
        >
          다시 시도
        </button>
      </section>
    );
  }

  return <MyBenefitsContent coupons={coupons} mileage={mileage} />;
}