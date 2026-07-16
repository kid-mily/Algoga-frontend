import { Download, Search } from "lucide-react";
import type { CountryProfitabilityItem } from "../types";
import {
  formatBookingCount,
  formatHundredMillion,
  formatPercent,
  getRateTextColor,
} from "../utils";

type CountryProfitabilityTableProps = {
  data: CountryProfitabilityItem[];
};

export default function CountryProfitabilityTable({
  data,
}: CountryProfitabilityTableProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-[18px] border border-[#EAECF0] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <h2 className="text-[17px] font-bold text-[#111827]">
          나라별 수익성 상세
        </h2>

        <div className="flex gap-2">
          <label className="flex h-9 items-center gap-2 rounded-[10px] border border-[#E4E7EC] px-3 text-[#98A2B3]">
            <Search size={14} />
            <input
              type="search"
              placeholder="국가 검색..."
              className="w-[130px] bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#98A2B3]"
            />
          </label>

          <button
            type="button"
            className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] px-3 text-[12px] font-semibold text-[#667085]"
          >
            <Download size={14} />
            CSV
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#F8FAFC] text-left text-[12px] font-semibold text-[#667085]">
            <tr>
              <th className="w-[10%] px-4 py-4">국가</th>
              <th className="w-[10%] px-3 py-4">예약수 ↕</th>
              <th className="w-[10%] px-3 py-4">총매출 ↕</th>
              <th className="w-[10%] px-3 py-4 text-[#2FAE9B]">순매출 ↓</th>
              <th className="w-[10%] px-3 py-4">환불율 ↕</th>
              <th className="w-[12%] px-3 py-4">잔금전환율 ↕</th>
              <th className="w-[10%] px-3 py-4">취소율 ↕</th>
              <th className="w-[18%] px-3 py-4">점유율 ↕</th>
              <th className="w-[10%] px-3 py-4">쿠폰전환율 ↕</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F6] text-[13px]">
            {data.map((country) => (
              <tr key={country.countryName}>
                <td className="px-4 py-4 font-bold text-[#111827]">
                  {country.countryName}
                </td>
                <td className="px-3 py-4 text-[#667085]">
                  {formatBookingCount(country.bookingCount)}
                </td>
                <td className="px-3 py-4 text-[#667085]">
                  {formatHundredMillion(country.grossRevenue)}
                </td>
                <td className="px-3 py-4 font-extrabold text-[#2FAE9B]">
                  {formatHundredMillion(country.netRevenue)}
                </td>
                <td className={`px-3 py-4 font-bold ${getRateTextColor(country.refundRate)}`}>
                  {formatPercent(country.refundRate)}
                </td>
                <td className="px-3 py-4 font-semibold text-[#2FAE9B]">
                  {formatPercent(country.balanceConversionRate)}
                </td>
                <td className={`px-3 py-4 font-bold ${getRateTextColor(country.cancelRate + 2)}`}>
                  {formatPercent(country.cancelRate)}
                </td>
                <td className="px-3 py-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 min-w-0 flex-1 rounded-full bg-[#EEF2F6]">
                      <span
                        className="block h-2 rounded-full bg-[#2FAE9B]"
                        style={{ width: `${Math.min(country.share, 100)}%` }}
                      />
                    </span>
                    <span className="shrink-0 font-bold text-[#111827]">
                      {formatPercent(country.share)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 text-[#667085]">
                  {formatPercent(country.couponConversionRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#EEF2F6] px-6 py-4 text-[13px] font-semibold text-[#98A2B3]">
        <span>총 {data.length}개 · 1/1 페이지</span>
        <div className="flex items-center gap-3">
          <button type="button" className="text-[#C0C7D0]">‹</button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2FAE9B] text-white"
          >
            1
          </button>
          <button type="button" className="text-[#C0C7D0]">›</button>
        </div>
      </div>
    </section>
  );
}
