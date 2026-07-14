import type { CountryRefundRate } from "../types";
import { getStatusClassName, getStatusLabel } from "../utils";

type CountryRefundRateTableProps = {
  data: CountryRefundRate[];
};

export default function CountryRefundRateTable({
  data,
}: CountryRefundRateTableProps) {
  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-sm">
      <header className="px-5 py-4">
        <h3 className="text-[17px] font-bold text-[#111827]">
          나라별 환불율
        </h3>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#F7F8FA]">
            <tr className="text-left text-[12px] font-semibold text-[#667085]">
              <th className="w-[28%] px-5 py-3">국가</th>
              <th className="w-[28%] px-5 py-3">예약건수</th>
              <th className="w-[22%] px-5 py-3">환불율</th>
              <th className="w-[22%] px-5 py-3">평가</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.countryName}
                className="border-b border-[#EEF0F3] text-[13px] text-[#344054]"
              >
                <td className="px-5 py-4 font-extrabold text-[#111827]">
                  {item.countryName}
                </td>
                <td className="px-5 py-4 font-medium text-[#98A2B3]">
                  {item.bookingCount.toLocaleString("ko-KR")}건
                </td>
                <td className="px-5 py-4 font-extrabold text-[#EF4444]">
                  {item.refundRate}%
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[12px] font-extrabold ${getStatusClassName(
                      item.status
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
