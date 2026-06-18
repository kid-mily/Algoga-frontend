"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import { useRevenueDetail } from "../hooks/useRevenueDetail";
import { formatMonthLabel } from "../utils";
import DailyRevenueChart from "./DailyRevenueChart";
import RevenuePaymentsTable from "./RevenuePaymentsTable";
import RevenueSummaryCards from "./RevenueSummaryCards";

type RevenueDetailClientProps = {
  year: number;
  month: number;
};

export default function RevenueDetailClient({
  year,
  month,
}: RevenueDetailClientProps) {
  const { data, isLoading, error } = useRevenueDetail(year, month);

  if (isLoading) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]"
      >
        월별 수익 상세를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <main aria-label="월별 수익 상세 조회">
      <SubHeader
        backHref="/moneyadmin/revenue"
        backText="월별 수익 목록으로 돌아가기"
        title={`${formatMonthLabel(year, month)} 수익 상세`}
        description="일별 수익과 해당 월 결제 내역을 확인합니다"
      />

      <AdminErrorBanner message={error} className="mb-4" />

      {data ? (
        <div className="space-y-5">
          <RevenueSummaryCards stat={data.detail} />
          <DailyRevenueChart data={data.detail.dailyStats} />
          <RevenuePaymentsTable payments={data.payments} />
        </div>
      ) : (
        <section
          role="status"
          aria-live="polite"
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]"
        >
          수익 상세 정보를 찾을 수 없습니다.
        </section>
      )}
    </main>
  );
}
