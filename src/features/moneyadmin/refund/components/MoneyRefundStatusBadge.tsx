import { MoneyRefundStatus } from "../types";

const statusStyle: Record<MoneyRefundStatus, string> = {
  "취소 요청": "bg-[#FFF7E6] text-[#B54708]",
  "정산 검토중": "bg-[#E0F2FE] text-[#0277BD]",
  "환불 승인": "bg-[#E7F4EC] text-[#439A97]",
  "반려": "bg-[#FEE2E2] text-[#DC2626]",
  "환불 완료": "bg-[#F2F4F7] text-[#667085]",
};

export default function MoneyRefundStatusBadge({
  status,
}: {
  status: MoneyRefundStatus;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-bold ${
        statusStyle[status]
      }`}
    >
      {status}
    </span>
  );
}
