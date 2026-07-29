import { Download } from "lucide-react";
import type { TopCustomer } from "../types";
import { formatWon } from "../utils";

type TopCustomerTableProps = {
  data: TopCustomer[];
  onDownloadCsv: () => void;
};

export default function TopCustomerTable({ data, onDownloadCsv }: TopCustomerTableProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-[18px] border border-[#EAECF0] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <h2 className="text-[17px] font-bold text-[#111827]">상위 고객 리스트</h2>
        <button
          type="button"
          onClick={onDownloadCsv}
          className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] px-3 text-[12px] font-semibold text-[#667085]"
        >
          <Download size={14} />
          CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead className="bg-[#F8FAFC] text-left text-[13px] font-semibold text-[#667085]">
            <tr>
              <th className="w-[70px] px-6 py-4">순위</th>
              <th className="px-6 py-4">이름</th>
              <th className="px-6 py-4">예약 수</th>
              <th className="px-6 py-4">누적 결제액</th>
              <th className="px-6 py-4">최근 여행지</th>
              <th className="px-6 py-4">평균 구매간격</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F6] text-[14px]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[13px] text-[#98A2B3]">
                  조회된 고객 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((customer) => (
                <tr key={customer.rank}>
                  <td className="px-6 py-4 font-extrabold text-[#2FAE9B]">
                    #{customer.rank}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#111827]">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#667085]">
                    {customer.bookingCount}회
                  </td>
                  <td className="px-6 py-4 font-extrabold text-[#2FAE9B]">
                    {formatWon(customer.cumulativePayment)}
                  </td>
                  <td className="px-6 py-4 text-[#667085]">
                    {customer.recentDestination}
                  </td>
                  <td className="px-6 py-4 text-[#667085]">
                    {customer.averagePurchaseIntervalDays}일
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
