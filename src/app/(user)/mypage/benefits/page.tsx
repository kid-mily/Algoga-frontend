"use client";

import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import MyPageSidebar from "@/features/mypage/MyPageSidebar";
import MyBenefitsContent from "@/features/mypage/benefits/components/MyBenefitsContent";
import { useMyBenefits } from "@/features/mypage/benefits/hooks/useMyBenefits";
import { useMyPage } from "@/features/mypage/hooks/useMyPageEditForm";

export default function MyBenefitsPage() {
  const {
    user,
    isLoading: isUserLoading,
    errorMessage: userErrorMessage,
  } = useMyPage();

  const {
    coupons,
    mileage,
    isLoading: isBenefitLoading,
    errorMessage: benefitErrorMessage,
    refetch,
  } = useMyBenefits();

  const isLoading = isUserLoading || isBenefitLoading;
  const errorMessage = userErrorMessage || benefitErrorMessage;

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA]">
        <LoadingSpinner />
      </main>
    );
  }

  if (errorMessage || !user) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#0A1628]">
            정보를 불러올 수 없습니다
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {errorMessage || "사용자 정보를 찾을 수 없습니다."}
          </p>

          <button
            type="button"
            onClick={refetch}
            className="mt-5 rounded-xl bg-[#439A97] px-5 py-2 text-sm font-bold text-white hover:bg-[#357F7C]"
          >
            다시 시도
          </button>
        </section>
      </main>
    );
  }

  const userInitial = user.name[0] ?? "?";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA]">
      <div className="flex min-h-[calc(100vh-64px)] w-full">
        <MyPageSidebar
          name={user.name}
          initial={userInitial}
          profileImageUrl={user.profileImageUrl}
        />

        <section className="flex-1 px-10 py-8">
          <div className="mx-auto w-full max-w-2xl">
            <MyBenefitsContent
              coupons={coupons}
              mileage={mileage}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
