import { ProductConversionStat } from "../types";
import { formatNumber, formatPercent } from "../utils";

type ProductConversionBarsProps = {
  products: ProductConversionStat[];
  isLoading: boolean;
};

export default function ProductConversionBars({
  products,
  isLoading,
}: ProductConversionBarsProps) {
  const visibleProducts = products.slice(0, 10);
  const maxRate = Math.max(1, ...visibleProducts.map((product) => product.conversionRate));

  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">상품별 전환율</h2>
      </header>

      <div className="p-6">
        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            상품별 전환율을 불러오는 중입니다...
          </p>
        ) : visibleProducts.length === 0 ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            상품별 전환율 데이터가 없습니다.
          </p>
        ) : (
          <ul className="space-y-4">
            {visibleProducts.map((product) => {
              const width = `${Math.max(2, (product.conversionRate / maxRate) * 100)}%`;

              return (
                <li key={product.accommodationId || product.productName}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-[13px]">
                    <p className="truncate font-semibold text-[#344054]">
                      {product.productName}
                    </p>
                    <p className="shrink-0 font-bold text-[#111827]">
                      {formatPercent(product.conversionRate)}
                    </p>
                  </div>
                  <div className="h-[12px] overflow-hidden rounded-full bg-[#F2F4F7]">
                    <div
                      className="h-full rounded-full bg-[#439A97]"
                      style={{ width }}
                    />
                  </div>
                  <p className="mt-1 text-[12px] text-[#98A2B3]">
                    시도 {formatNumber(product.attemptCount)}건 · 완료{" "}
                    {formatNumber(product.completedCount)}건
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
