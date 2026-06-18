import { MoneyRefund, MoneyRefundAction } from "../types";
import MoneyRefundRow from "./MoneyRefundRow";

type MoneyRefundTableProps = {
  refunds: MoneyRefund[];
  isLoading: boolean;
  processingId: number | null;
  onAction: (refund: MoneyRefund, action: MoneyRefundAction) => void;
};

export default function MoneyRefundTable({
  refunds,
  isLoading,
  processingId,
  onAction,
}: MoneyRefundTableProps) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th className="w-[132px] px-5 py-4">요청번호</th>
            <th className="w-[150px] px-5 py-4">예약번호</th>
            <th className="w-[130px] px-5 py-4">사용자</th>
            <th className="px-5 py-4">상품명</th>
            <th className="w-[140px] px-5 py-4">환불금액</th>
            <th className="w-[130px] px-5 py-4">요청일</th>
            <th className="w-[120px] px-5 py-4">상태</th>
            <th className="w-[210px] px-5 py-4">처리</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <EmptyRow text="환불 요청을 불러오는 중입니다..." />
          ) : refunds.length > 0 ? (
            refunds.map((refund) => (
              <MoneyRefundRow
                key={refund.refundId}
                refund={refund}
                processingId={processingId}
                onAction={onAction}
              />
            ))
          ) : (
            <EmptyRow text="조건에 맞는 환불 요청이 없습니다." />
          )}
        </tbody>
      </table>
    </section>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <tr>
      <td
        colSpan={8}
        role="status"
        aria-live="polite"
        className="px-6 py-12 text-center text-[14px] text-[#667085]"
      >
        {text}
      </td>
    </tr>
  );
}
