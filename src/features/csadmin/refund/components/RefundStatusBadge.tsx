import { CsRefundStatus } from "../types";

export default function RefundStatusBadge({ status }: { status: CsRefundStatus }) {
  if (status === "취소 요청") {
    return (
      <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-[#FFEDD5] px-3 py-1 text-[12px] font-bold text-[#EA580C]">
        <span aria-hidden="true">●</span>
        취소 요청
      </span>
    );
  }

  if (status === "정산 검토중") {
    return (
      <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-[#EEF4FF] px-3 py-1 text-[12px] font-bold text-[#4F46E5]">
        <span aria-hidden="true">●</span>
        정산 검토중
      </span>
    );
  }

  if (status === "환불 승인") {
    return (
      <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-[12px] font-bold text-[#16A34A]">
        <span aria-hidden="true">●</span>
        환불 승인
      </span>
    );
  }

  if (status === "환불 완료") {
    return (
      <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-[#E0F2FE] px-3 py-1 text-[12px] font-bold text-[#0284C7]">
        <span aria-hidden="true">●</span>
        환불 완료
      </span>
    );
  }

  return (
    <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-[#FEE2E2] px-3 py-1 text-[12px] font-bold text-[#DC2626]">
      <span aria-hidden="true">●</span>
      반려
    </span>
  );
}
