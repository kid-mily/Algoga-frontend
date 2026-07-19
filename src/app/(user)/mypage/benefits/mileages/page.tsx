"use client";

import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import MyPageLayout from "@/features/mypage/MyPageLayout";
import { MileageSummaryCard } from "@/features/mypage/benefits/components/MileageSummaryCard";
import { MileageHistoryTable } from "@/features/mypage/benefits/components/MileageHistoryTable";
import { useMyBenefits } from "@/features/mypage/benefits/hooks/useMyBenefits";

// 마이페이지 - 마일리지 내역 전체보기 페이지
export default function MyMileagesPage() {
  const { mileage, isLoading, errorMessage, refetch } = useMyBenefits();

  return (
    <MyPageLayout
      title="마일리지 내역"
      description="마일리지 적립/사용 내역을 사유와 함께 확인할 수 있어요."
      showBackButton
    >
      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white">
          <LoadingSpinner />
        </div>
      ) : errorMessage ? (
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-[#0A1628]">
            마일리지 정보를 불러올 수 없습니다.
          </h2>

          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>

          <button
            type="button"
            onClick={refetch}
            className="mt-5 rounded-xl bg-[#439A97] px-5 py-2 text-sm font-bold text-white hover:bg-[#357F7C]"
          >
            다시 시도
          </button>
        </section>
      ) : (
        <div className="space-y-4">
          <MileageSummaryCard mileage={mileage} />

          <MileageHistoryTable
            histories={mileage.histories ?? []}
            showReason
          />
        </div>
      )}
    </MyPageLayout>
  );
}
