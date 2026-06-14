import Link from "next/link";
import { CsRefund } from "../types";
import RefundStatusBadge from "./RefundStatusBadge";

type RefundAction = "review" | "approve" | "reject" | "complete";

type CsRefundRowProps = {
  refund: CsRefund;
  processingId: number | null;
  onAction: (refundId: number, action: RefundAction) => void;
};

const canReview = (status: CsRefund["status"]) => status === "취소 요청";
const canApprove = (status: CsRefund["status"]) => status === "정산 검토중";
const canReject = (status: CsRefund["status"]) =>
  status === "취소 요청" || status === "정산 검토중";
const canComplete = (status: CsRefund["status"]) => status === "환불 승인";

export default function CsRefundRow({
  refund,
  processingId,
  onAction,
}: CsRefundRowProps) {
  const isProcessing = processingId === refund.refundId;

  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="px-4 py-5 font-semibold">{refund.id}</td>
      <td className="px-4 py-5 font-semibold text-[#439A97]">
        {refund.bookingId}
      </td>
      <td className="px-4 py-5">{refund.user}</td>
      <td className="px-4 py-5">{refund.product}</td>
      <td className="px-4 py-5 text-[#667085]">{refund.requestedAt}</td>
      <td className="px-4 py-5">{refund.reason}</td>
      <td className="px-4 py-5">
        <RefundStatusBadge status={refund.status} />
      </td>
      <td className="px-4 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/csadmin/refund/${refund.refundId}`}
            className="rounded-[8px] border border-[#D0D5DD] px-3 py-2 text-[13px] font-semibold text-[#344054]"
          >
            상세
          </Link>
          {canReview(refund.status) && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onAction(refund.refundId, "review")}
              className="rounded-[8px] border border-[#D0D5DD] px-3 py-2 text-[13px] font-semibold text-[#344054] disabled:opacity-50"
            >
              검토
            </button>
          )}
          {canApprove(refund.status) && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onAction(refund.refundId, "approve")}
              className="rounded-[8px] border border-[#BBF7D0] px-3 py-2 text-[13px] font-semibold text-[#16A34A] disabled:opacity-50"
            >
              승인
            </button>
          )}
          {canReject(refund.status) && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onAction(refund.refundId, "reject")}
              className="rounded-[8px] border border-[#FCA5A5] px-3 py-2 text-[13px] font-semibold text-[#DC2626] disabled:opacity-50"
            >
              반려
            </button>
          )}
          {canComplete(refund.status) && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onAction(refund.refundId, "complete")}
              className="rounded-[8px] border border-[#BBF7D0] px-3 py-2 text-[13px] font-semibold text-[#16A34A] disabled:opacity-50"
            >
              완료
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
