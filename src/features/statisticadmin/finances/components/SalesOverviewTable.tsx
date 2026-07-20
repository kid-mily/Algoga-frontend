"use client";

import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import {
  formatMillionAmount,
  formatPercentValue,
  formatRateValue,
} from "../utils/salesOverviewFormatters";

import { SalesOverviewTableProps } from '../types';

export default function SalesOverviewTable({
  monthlyStats,
  onDownloadCsv,
}: SalesOverviewTableProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCsv = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await onDownloadCsv();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#EAECF0] bg-white shadow-[0_12px_28px_rgba(16,24,40,0.05)]">
      <header className="flex items-center justify-between px-6 py-5">
        <h2 className="text-[17px] font-bold text-[#101828]">월별 매출 상세</h2>
        <button
          type="button"
          onClick={() => void handleDownloadCsv()}
          disabled={isDownloading}
          className="flex h-[32px] cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#E4E7EC] bg-white px-3 text-[12px] font-semibold text-[#667085] disabled:opacity-60"
        >
          <ArrowDownToLine
            aria-hidden="true"
            className="h-[14px] w-[14px]"
            strokeWidth={2}
          />
          {isDownloading ? "다운로드 중..." : "CSV"}
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-[#F8FAFC]">
            <tr className="text-[12px] font-bold text-[#667085]">
              <th className="px-6 py-4">월</th>
              <th className="px-6 py-4">총매출</th>
              <th className="px-6 py-4">환불액</th>
              <th className="px-6 py-4">순매출</th>
              <th className="px-6 py-4">환불율</th>
              <th className="px-6 py-4">전월 대비</th>
            </tr>
          </thead>
          <tbody>
            {monthlyStats.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-14 text-center text-[14px] font-medium text-[#98A2B3]"
                >
                  조회된 매출 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              monthlyStats.map((item) => (
                <tr
                  key={item.month}
                  className="border-t border-[#F2F4F7] text-[14px]"
                >
                  <td className="px-6 py-5 font-semibold text-[#101828]">
                    {item.month}
                  </td>
                  <td className="px-6 py-5 text-[#344054]">
                    {formatMillionAmount(item.grossSales)}
                  </td>
                  <td className="px-6 py-5 text-[#EC4899]">
                    -{formatMillionAmount(item.refundAmount)}
                  </td>
                  <td className="px-6 py-5 font-bold text-[#2BB3A3]">
                    {formatMillionAmount(item.netSales)}
                  </td>
                  <td className="px-6 py-5 text-[#F59E0B]">
                    {formatRateValue(item.refundRate)}
                  </td>
                  <td className="px-6 py-5">
                    {item.changeRate === null ? (
                      <span className="text-[#C1C7D0]">-</span>
                    ) : (
                      <ChangeBadge value={item.changeRate} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChangeBadge({ value }: { value: number }) {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[12px] font-bold ${
        isPositive ? "bg-[#E6F8EF] text-[#12B76A]" : "bg-[#FFECEF] text-[#F04438]"
      }`}
    >
      {formatPercentValue(value)}
    </span>
  );
}
