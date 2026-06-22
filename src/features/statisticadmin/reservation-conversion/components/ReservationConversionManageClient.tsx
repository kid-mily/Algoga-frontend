"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import { useReservationConversion } from "../hooks/useReservationConversion";
import { formatNumber, formatPercent } from "../utils";
import DailyConversionChart from "./DailyConversionChart";
import ProductConversionBars from "./ProductConversionBars";
import ProductConversionRanking from "./ProductConversionRanking";
import ReservationConversionSummaryCards from "./ReservationConversionSummaryCards";
import ReservationConversionToolbar from "./ReservationConversionToolbar";

export default function ReservationConversionManageClient() {
  const {
    fromDate,
    toDate,
    summary,
    daily,
    products,
    isLoading,
    error,
    setFromDate,
    setToDate,
  } = useReservationConversion();

  return (
    <main aria-label="예약 전환율 분석">
      <SimpleSubHeader
        title="예약 전환율 분석"
        description={`결제 페이지 진입 ${formatNumber(summary.attemptCount)}건 | 예약 완료 ${formatNumber(summary.completedCount)}건 | 전환율 ${formatPercent(summary.conversionRate)}`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <ReservationConversionToolbar
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <ReservationConversionSummaryCards summary={summary} />

      <DailyConversionChart data={daily} isLoading={isLoading} />

      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <ProductConversionBars
          products={products.products}
          isLoading={isLoading}
        />

        <div className="space-y-5">
          {isLoading ? (
            <section
              role="status"
              aria-live="polite"
              className="rounded-[16px] border border-[#E4E7EC] bg-white px-5 py-12 text-center text-[14px] text-[#667085]"
            >
              상품 순위를 불러오는 중입니다...
            </section>
          ) : (
            <>
              <ProductConversionRanking
                title="전환율 상위 상품"
                products={products.topProducts}
                emptyText="상위 상품 데이터가 없습니다."
              />
              <ProductConversionRanking
                title="전환율 하위 상품"
                products={products.bottomProducts}
                emptyText="하위 상품 데이터가 없습니다."
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
