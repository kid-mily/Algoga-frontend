import { CountryPopularityStat } from "../types";
import { formatNumber, formatPercent, formatWon } from "../utils";

type CountryPopularityTableProps = {
  countries: CountryPopularityStat[];
  isLoading: boolean;
};

const COLUMN_COUNT = 8;

function EmptyRow({ message }: { message: string }) {
  return (
    <tr>
      <td
        colSpan={COLUMN_COUNT}
        role="status"
        aria-live="polite"
        className="px-5 py-12 text-center text-[14px] text-[#667085]"
      >
        {message}
      </td>
    </tr>
  );
}

export default function CountryPopularityTable({
  countries,
  isLoading,
}: CountryPopularityTableProps) {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">나라별 통계 목록</h2>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-left text-[14px]">
          <thead className="bg-[#F9FAFB] text-[13px] text-[#667085]">
            <tr>
              <th className="px-5 py-3 font-semibold">순위</th>
              <th className="px-5 py-3 font-semibold">국가 ID</th>
              <th className="px-5 py-3 font-semibold">국가명</th>
              <th className="px-5 py-3 font-semibold">조회 수</th>
              <th className="px-5 py-3 font-semibold">예약 완료</th>
              <th className="px-5 py-3 font-semibold">전환율</th>
              <th className="px-5 py-3 font-semibold">인기도 점수</th>
              <th className="px-5 py-3 font-semibold">수익</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF0F3] text-[#344054]">
            {isLoading ? (
              <EmptyRow message="나라별 통계 목록을 불러오는 중입니다..." />
            ) : countries.length === 0 ? (
              <EmptyRow message="나라별 통계 데이터가 없습니다." />
            ) : (
              countries.map((country, index) => (
                <tr key={`${country.countryId}-${country.countryName}-${index}`}>
                  <td className="px-5 py-4 font-semibold text-[#111827]">
                    {country.rank || index + 1}
                  </td>
                  <td className="px-5 py-4">{country.countryId || "-"}</td>
                  <td className="px-5 py-4 font-semibold text-[#111827]">
                    {country.countryName}
                  </td>
                  <td className="px-5 py-4">
                    {formatNumber(country.viewCount)}건
                  </td>
                  <td className="px-5 py-4">
                    {formatNumber(country.bookingCount)}건
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#439A97]">
                    {formatPercent(country.conversionRate)}
                  </td>
                  <td className="px-5 py-4">
                    {formatNumber(country.popularityScore)}
                  </td>
                  <td className="px-5 py-4">{formatWon(country.revenueAmount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
