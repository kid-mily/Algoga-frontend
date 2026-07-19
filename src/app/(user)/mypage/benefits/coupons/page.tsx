"use client";

import { useMemo, useState } from "react";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import MyPageLayout from "@/features/mypage/MyPageLayout";
import CouponCard from "@/features/mypage/benefits/components/CouponCard";
import { useMyBenefits } from "@/features/mypage/benefits/hooks/useMyBenefits";

type CouponTab = "usable" | "used";

const TABS: { value: CouponTab; label: string }[] = [
  { value: "usable", label: "사용 가능" },
  { value: "used", label: "사용 완료" },
];

// 마이페이지 - 쿠폰함 전체보기 페이지
export default function MyCouponsPage() {
  const { coupons, isLoading, errorMessage, refetch } = useMyBenefits();
  const [activeTab, setActiveTab] = useState<CouponTab>("usable");

  const grouped = useMemo(
    () => ({
      usable: coupons.filter((coupon) => coupon.usable),
      used: coupons.filter((coupon) => !coupon.usable),
    }),
    [coupons]
  );

  const visibleCoupons = grouped[activeTab];

  return (
    <MyPageLayout
      title="쿠폰함"
      description="보유한 쿠폰을 모두 확인할 수 있어요."
      showBackButton
    >
      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white">
          <LoadingSpinner />
        </div>
      ) : errorMessage ? (
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-[#0A1628]">
            쿠폰 정보를 불러올 수 없습니다.
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
        <>
          <div className="flex gap-6 border-b border-[#E5EDF5]">
            {TABS.map((tab) => {
              const isActive = tab.value === activeTab;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-1.5 border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${
                    isActive
                      ? "border-[#439A97] text-[#439A97]"
                      : "border-transparent text-[#0A1628] hover:text-[#439A97]"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                      isActive
                        ? "bg-[#EEF8F7] text-[#439A97]"
                        : "bg-[#F3F8FC] text-[#8A9BB0]"
                    }`}
                  >
                    {grouped[tab.value].length}
                  </span>
                </button>
              );
            })}
          </div>

          {visibleCoupons.length === 0 ? (
            <div className="mt-4 flex min-h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                {activeTab === "usable"
                  ? "사용 가능한 쿠폰이 없습니다."
                  : "사용 완료된 쿠폰이 없습니다."}
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visibleCoupons.map((coupon) => (
                <CouponCard key={coupon.userCouponId} coupon={coupon} />
              ))}
            </div>
          )}
        </>
      )}
    </MyPageLayout>
  );
}
