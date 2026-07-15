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

// 반려는 CS매니저 단계(REQUESTED)에서만 가능해서 정산매니저 화면엔 반려 버튼이 없습니다.
const canApprove = (refund: MoneyRefund) =>
  getMoneyNextStatusOptions(refund.statusCode).includes("환불 승인");

const canComplete = (refund: MoneyRefund) =>
  getMoneyNextStatusOptions(refund.statusCode).includes("환불 완료");

export default function MoneyRefundRow({
  refund,
  processingId,
  actionsDisabled,
  onAction,
}: MoneyRefundRowProps) {
  const isProcessing = processingId === refund.refundId;
  const isActionDisabled = actionsDisabled || isProcessing;

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
          <button
            type="button"
            disabled={isActionDisabled || !canApprove(refund)}
            onClick={() => onAction(refund, "approve")}
            className="h-[32px] rounded-[8px] bg-[#439A97] px-3 text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            승인
          </button>
          <button
            type="button"
            disabled={isActionDisabled || !canComplete(refund)}
            onClick={() => onAction(refund, "complete")}
            className="h-[32px] rounded-[8px] bg-[#111827] px-3 text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            완료
          </button>
        </div>
      </td>
    </tr>
  );
}
