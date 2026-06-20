import { CountryPopularityStat } from "../types";
import { formatNumber, formatPercent } from "../utils";

type CountryPopularityTopChartProps = {
  countries: CountryPopularityStat[];
  isLoading: boolean;
};

export default function CountryPopularityTopChart({
  countries,
  isLoading,
}: CountryPopularityTopChartProps) {
  const maxScore = Math.max(
    1,
    ...countries.map((country) => country.popularityScore)
  );

  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">나라별 Top 10</h2>
      </header>

      <div className="p-6">
        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            나라별 Top 10을 불러오는 중입니다...
          </p>
        ) : countries.length === 0 ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            나라별 Top 10 데이터가 없습니다.
          </p>
        ) : (
          <ol className="space-y-4">
            {countries.slice(0, 10).map((country, index) => {
              const width = `${Math.max(
                3,
                (country.popularityScore / maxScore) * 100
              )}%`;

              return (
                <li key={`${country.countryId}-${country.countryName}-${index}`}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-[13px]">
                    <p className="truncate font-semibold text-[#344054]">
                      {country.rank || index + 1}. {country.countryName}
                    </p>
                    <p className="shrink-0 font-bold text-[#111827]">
                      {formatPercent(country.conversionRate)}
                    </p>
                  </div>
                  <div className="h-[12px] overflow-hidden rounded-full bg-[#F2F4F7]">
                    <div
                      className="h-full rounded-full bg-[#439A97]"
                      style={{ width }}
                    />
                  </div>
                  <p className="mt-1 text-[12px] text-[#98A2B3]">
                    조회 {formatNumber(country.viewCount)}건 · 예약{" "}
                    {formatNumber(country.bookingCount)}건
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
