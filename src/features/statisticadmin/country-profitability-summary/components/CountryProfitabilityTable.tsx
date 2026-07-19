"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import type { CountryProfitabilityItem } from "../types";
import {
  formatBookingCount,
  formatManwon,
  formatPercent,
  getRateTextColor,
} from "../utils";

const PAGE_SIZE = 10;

type CountryProfitabilityTableProps = {
  data: CountryProfitabilityItem[];
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  onDownloadCsv: () => void;
};

export default function CountryProfitabilityTable({
  data,
  search,
  onSearchChange,
  isLoading = false,
  onDownloadCsv,
}: CountryProfitabilityTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 새 검색 결과가 오면 1페이지로 되돌립니다.
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, safeCurrentPage]);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

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
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="국가 검색..."
              className="w-[130px] bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#98A2B3]"
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
      </div>

      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#F8FAFC] text-left text-[12px] font-semibold text-[#667085]">
            <tr>
              <th className="w-[12%] px-4 py-4">국가</th>
              <th className="w-[11%] px-3 py-4">예약수</th>
              <th className="w-[12%] px-3 py-4">총매출</th>
              <th className="w-[12%] px-3 py-4 text-[#2FAE9B]">순매출</th>
              <th className="w-[11%] px-3 py-4">환불율</th>
              <th className="w-[13%] px-3 py-4">잔금전환율</th>
              <th className="w-[11%] px-3 py-4">취소율</th>
              <th className="w-[18%] px-3 py-4">점유율</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F6] text-[13px]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[13px] text-[#98A2B3]">
                  나라별 수익성 목록을 불러오는 중입니다...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[13px] text-[#98A2B3]">
                  조회된 나라별 수익성 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              pagedData.map((country) => (
              <tr key={country.countryName}>
                <td className="px-4 py-4 font-bold text-[#111827]">
                  {country.countryName}
                </td>
                <td className="px-3 py-4 text-[#667085]">
                  {formatBookingCount(country.bookingCount)}
                </td>
                <td className="px-3 py-4 text-[#667085]">
                  {formatManwon(country.grossRevenue)}
                </td>
                <td className="px-3 py-4 font-extrabold text-[#2FAE9B]">
                  {formatManwon(country.netRevenue)}
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
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#EEF2F6] px-6 py-4 text-[13px] font-semibold text-[#98A2B3]">
        <span>
          총 {data.length}개 · {safeCurrentPage}/{totalPages} 페이지
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage <= 1}
            aria-label="이전 페이지"
            className="text-[#667085] disabled:cursor-not-allowed disabled:text-[#C0C7D0]"
          >
            ‹
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-current={page === safeCurrentPage ? "page" : undefined}
              className={
                page === safeCurrentPage
                  ? "flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2FAE9B] text-white"
                  : "flex h-8 w-8 items-center justify-center rounded-[8px] text-[#667085]"
              }
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage >= totalPages}
            aria-label="다음 페이지"
            className="text-[#667085] disabled:cursor-not-allowed disabled:text-[#C0C7D0]"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
