import type { RefundReason } from "../types";

type RefundReasonTableProps = {
  data: RefundReason[];
};

export default function RefundReasonTable({ data }: RefundReasonTableProps) {
  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-sm">
      <header className="px-5 py-4">
        <h3 className="text-[17px] font-bold text-[#111827]">환불 사유</h3>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#F7F8FA]">
            <tr className="text-left text-[12px] font-semibold text-[#667085]">
              <th className="w-[36%] px-5 py-3">사유</th>
              <th className="w-[24%] px-5 py-3">건수</th>
              <th className="w-[40%] px-5 py-3">비율</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.reason}
                className="border-b border-[#EEF0F3] text-[13px] text-[#344054]"
              >
                <td className="px-5 py-4 font-bold text-[#344054]">
                  {item.reason}
                </td>
                <td className="px-5 py-4 font-extrabold text-[#2FAE9B]">
                  {item.count}건
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F4F7]">
                      <div
                        className="h-full rounded-full bg-[#EC4899]"
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-[12px] font-medium text-[#98A2B3]">
                      {item.rate}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
