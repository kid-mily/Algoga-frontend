import { Download, Search } from "lucide-react";
import type { CountryDetailStat } from "../types";

type CountryDetailStatsTableProps = {
  data: CountryDetailStat[];
  onDownloadCsv: () => void;
};

const formatNumber = (value: number) => Number(value ?? 0).toLocaleString();
const formatMoney = (amount: number) => `${formatNumber(amount)}원`;
const formatRate = (rate: number) => `${Number(rate ?? 0)}%`;

export default function CountryDetailStatsTable({
  data,
  onDownloadCsv,
}: CountryDetailStatsTableProps) {
  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-4">
        <h3 className="text-[16px] font-bold text-[#111827]">
          국가별 상세 통계
        </h3>

        <div className="flex items-center gap-2">
          <label className="flex h-9 w-[180px] items-center rounded-[10px] border border-[#E4E7EC] px-3">
            <Search size={14} className="text-[#98A2B3]" />
            <span className="sr-only">국가명 검색</span>
            <input
              type="text"
              placeholder="국가명 검색..."
              className="ml-2 w-full bg-transparent text-[12px] outline-none placeholder:text-[#98A2B3]"
            />
          </label>

          <button
            type="button"
            onClick={onDownloadCsv}
            className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] px-3 text-[12px] font-semibold text-[#667085]"
          >
            <Download size={14} />
            CSV
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed border-collapse">
          <thead className="bg-[#F7F8FA]">
            <tr className="text-left text-[12px] font-semibold text-[#667085]">
              <th className="w-[7%] px-5 py-3">순위</th>
              <th className="w-[17%] px-5 py-3">국가</th>
              <th className="w-[13%] px-5 py-3">예약 수</th>
              <th className="w-[16%] px-5 py-3">총매출</th>
              <th className="w-[16%] px-5 py-3">순매출</th>
              <th className="w-[10%] px-5 py-3">환불율</th>
              <th className="w-[11%] px-5 py-3">잔금전환율</th>
              <th className="w-[10%] px-5 py-3">점유율</th>
            </tr>
          </thead>

          <tbody>
            {data.map((country) => (
              <tr
                key={country.rank}
                className="border-b border-[#EEF0F3] text-[13px] text-[#111827]"
              >
                <td className="px-5 py-4 font-bold text-[#2FAE9B]">
                  #{country.rank}
                </td>
                <td className="px-5 py-4 font-semibold">
                  <span className="mr-3 inline-block h-2 w-2 rounded-full bg-[#2FAE9B]" />
                  {country.countryName}
                </td>
                <td className="px-5 py-4 font-bold text-[#2FAE9B]">
                  {formatNumber(country.bookingCount)}
                </td>
                <td className="px-5 py-4">{formatMoney(country.grossRevenue)}</td>
                <td className="px-5 py-4 font-semibold">
                  {formatMoney(country.netRevenue)}
                </td>
                <td className="px-5 py-4 text-[#F59E0B]">
                  {formatRate(country.refundRate)}
                </td>
                <td className="px-5 py-4 text-[#2FAE9B]">
                  {formatRate(country.balanceConversionRate)}
                </td>
                <td className="px-5 py-4 text-[#667085]">
                  {formatRate(country.share)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between px-5 py-4 text-[12px] text-[#98A2B3]">
        <p>총 20개 · 1/2 페이지</p>
        <div className="flex items-center gap-3">
          <button type="button" className="text-[#CBD0D6]">
            ‹
          </button>
          <button
            type="button"
            className="h-7 w-7 rounded-[7px] bg-[#2FAE9B] font-bold text-white"
          >
            1
          </button>
          <button type="button" className="font-semibold text-[#667085]">
            2
          </button>
          <button type="button" className="text-[#667085]">
            ›
          </button>
        </div>
      </footer>
    </article>
  );
}
