import { PointHistory } from "../types";

interface PointHistoryRowProps {
  log: PointHistory;
}

export default function PointHistoryRow({ log }: PointHistoryRowProps) {
  const isPlus = log.type === "GIVE" || log.type === "EARN" || log.type === "적립";
  const dateText = log.createdAt ? log.createdAt.substring(0, 10) : "-";

  return (
    <tr className="border-b border-[#E4E7EC]">
      <td className="px-6 py-5">
        <span className="flex items-center gap-2 text-[15px] text-[#667085]">
          <img
            src="/images/calendar.svg"
            alt=""
            aria-hidden="true"
            className="h-[15px] w-[15px]"
          />
          {dateText}
        </span>
      </td>
      <td
        className={`px-6 py-5 text-[15px] font-semibold ${
          isPlus ? "text-[#16A34A]" : "text-[#DC2626]"
        }`}
      >
        {isPlus ? "지급 (적립)" : "사용 (회수)"}
      </td>
      <td
        className={`px-6 py-5 text-[18px] font-bold ${
          isPlus ? "text-[#16A34A]" : "text-[#DC2626]"
        }`}
      >
        {isPlus ? "+" : "-"}
        {log.amount.toLocaleString()}원
      </td>
      <td className="px-6 py-5 text-[15px] text-[#344054]">
        {log.reason}
      </td>
    </tr>
  );
}
