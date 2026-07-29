import { Download } from "lucide-react";
import type { CouponPerformance } from "../types";
import { formatCouponCount, formatPercent } from "../utils";

type CouponPerformanceTableProps = {
  rows: CouponPerformance[];
  onDownloadCsv: () => void;
};

export default function CouponPerformanceTable({
  rows,
  onDownloadCsv,
}: CouponPerformanceTableProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-[18px] border border-[#EAECF0] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#EEF2F6] px-6 py-5">
        <h2 className="text-[17px] font-bold text-[#111827]">쿠폰별 성과</h2>

        <button
          type="button"
          onClick={onDownloadCsv}
          className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] bg-white px-3 text-[12px] font-semibold text-[#667085]"
        >
          <Download size={14} />
          CSV
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-left text-[13px] font-bold text-[#667085]">
              <th className="px-6 py-4">쿠폰명</th>
              <th className="w-[180px] px-6 py-4">발급</th>
              <th className="w-[180px] px-6 py-4">사용</th>
              <th className="w-[360px] px-6 py-4">사용률</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-[13px] text-[#98A2B3]"
                >
                  조회된 쿠폰 성과 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
              <tr
                key={row.couponName}
                className="border-t border-[#EEF2F6] text-[14px] text-[#344054]"
              >
                <td className="px-6 py-4 font-bold text-[#111827]">
                  {row.couponName}
                </td>
                <td className="px-6 py-4 text-[#98A2B3]">
                  {formatCouponCount(row.issuedCount)}
                </td>
                <td className="px-6 py-4 text-[#98A2B3]">
                  {formatCouponCount(row.usedCount)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className="h-full rounded-full bg-[#F4A62A]"
                        style={{ width: `${Math.min(row.usageRate, 100)}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-[13px] font-bold text-[#F59E0B]">
                      {formatPercent(row.usageRate)}
                    </span>
                  </div>
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
