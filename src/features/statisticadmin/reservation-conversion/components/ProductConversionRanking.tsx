import { ProductConversionStat } from "../types";
import { formatNumber, formatPercent } from "../utils";

type ProductConversionRankingProps = {
  title: string;
  products: ProductConversionStat[];
  emptyText: string;
};

export default function ProductConversionRanking({
  title,
  products,
  emptyText,
}: ProductConversionRankingProps) {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-5 py-4">
        <h2 className="text-[16px] font-bold text-[#111827]">{title}</h2>
      </header>

      {products.length === 0 ? (
        <p
          role="status"
          aria-live="polite"
          className="px-5 py-8 text-center text-[14px] text-[#667085]"
        >
          {emptyText}
        </p>
      ) : (
        <ol className="divide-y divide-[#EEF0F3]">
          {products.map((product, index) => (
            <li
              key={`${product.accommodationId}-${product.productName}-${index}`}
              className="flex items-center gap-3 px-5 py-4"
            >
              <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#E7F4EC] text-[12px] font-bold text-[#439A97]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-[#344054]">
                  {product.productName}
                </p>
                <p className="mt-1 text-[12px] text-[#98A2B3]">
                  {formatNumber(product.completedCount)} /{" "}
                  {formatNumber(product.attemptCount)}건
                </p>
              </div>
              <p className="shrink-0 text-[14px] font-bold text-[#111827]">
                {formatPercent(product.conversionRate)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
