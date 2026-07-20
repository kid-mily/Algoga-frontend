import { getMoneyNextStatusOptions } from "@/features/csadmin/refund/types";
import { MoneyRefund, MoneyRefundAction } from "../types";
import { formatWon } from "../utils";
import MoneyRefundStatusBadge from "./MoneyRefundStatusBadge";

type MoneyRefundRowProps = {
  refund: MoneyRefund;
  processingId: number | null;
  actionsDisabled: boolean;
  onAction: (refund: MoneyRefund, action: MoneyRefundAction) => void;
};

// 정산매니저는 정산 검토중 단계에서 CS 통과분을 재심사해 승인/반려하고, 승인 후에는 완료합니다.
const canApprove = (refund: MoneyRefund) =>
  getMoneyNextStatusOptions(refund.statusCode).includes("환불 승인");

const canComplete = (refund: MoneyRefund) =>
  getMoneyNextStatusOptions(refund.statusCode).includes("환불 완료");

const canReject = (refund: MoneyRefund) =>
  getMoneyNextStatusOptions(refund.statusCode).includes("반려");

export default function MoneyRefundRow({
  refund,
  processingId,
  actionsDisabled,
  onAction,
}: MoneyRefundRowProps) {
  const isProcessing = processingId === refund.refundId;
  const isActionDisabled = actionsDisabled || isProcessing;
  const showApprove = canApprove(refund);
  const showComplete = canComplete(refund);
  const showReject = canReject(refund);
  const hasAction = showApprove || showComplete || showReject;

  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="px-5 py-5 font-semibold text-[#111827]">{refund.id}</td>
      <td className="px-5 py-5">
        <p className="font-semibold text-[#111827]">{refund.bookingId}</p>
        <p className="mt-1 text-[12px] text-[#98A2B3]">결제 #{refund.paymentId}</p>
      </td>
      <td className="px-5 py-5">{refund.user}</td>
      <td className="px-5 py-5">{refund.product}</td>
      <td className="px-5 py-5 font-semibold text-[#111827]">
        {formatWon(refund.refundAmount)}
      </td>
      <td className="px-5 py-5 text-[#667085]">{refund.requestedAt}</td>
      <td className="px-5 py-5">
        <MoneyRefundStatusBadge status={refund.status} />
      </td>
      <td className="px-5 py-5">
        <div className="flex items-center gap-2">
          {showApprove && (
            <button
              type="button"
              disabled={isActionDisabled}
              onClick={() => onAction(refund, "approve")}
              className="h-[32px] rounded-[8px] bg-[#439A97] px-3 text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              승인
            </button>
          )}
          {showComplete && (
            <button
              type="button"
              disabled={isActionDisabled}
              onClick={() => onAction(refund, "complete")}
              className="h-[32px] rounded-[8px] bg-[#111827] px-3 text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              완료
            </button>
          )}
          {showReject && (
            <button
              type="button"
              disabled={isActionDisabled}
              onClick={() => onAction(refund, "reject")}
              className="h-[32px] rounded-[8px] bg-[#D92D20] px-3 text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              반려
            </button>
          )}
          {!hasAction && <span className="text-[13px] text-[#98A2B3]">-</span>}
        </div>
      </td>
    </tr>
  );
}
