import Link from "next/link";
import { CsRefund } from "../types";
import RefundStatusBadge from "./RefundStatusBadge";

type CsRefundRowProps = {
  refund: CsRefund;
};

export default function CsRefundRow({ refund }: CsRefundRowProps) {
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
            aria-label={`상세 보기: 환불 ${refund.refundId}`}
            className="rounded-[8px] border border-[#D0D5DD] px-3 py-2 text-[13px] font-semibold text-[#344054]"
          >
            상세
          </Link>
        </div>
      </td>
    </tr>
  );
}
