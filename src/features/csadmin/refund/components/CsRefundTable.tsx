import { CsRefund } from "../types";
import CsRefundRow from "./CsRefundRow";

type RefundAction = "review" | "approve" | "reject" | "complete";

type CsRefundTableProps = {
  refunds: CsRefund[];
  isLoading: boolean;
  processingId: number | null;
  onAction: (refundId: number, action: RefundAction) => void;
};

export default function CsRefundTable({
  refunds,
  isLoading,
  processingId,
  onAction,
}: CsRefundTableProps) {
  return (
    <section
      className="overflow-x-auto rounded-[16px] border border-[#E4E7EC] bg-white"
      aria-labelledby="refund-table-title"
    >
      <h2 id="refund-table-title" className="sr-only">
        환불 요청 목록
      </h2>
      <table className="min-w-[1180px] w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th scope="col" className="w-[110px] px-4 py-4">요청번호</th>
            <th scope="col" className="w-[160px] px-4 py-4">예약번호</th>
            <th scope="col" className="w-[110px] px-4 py-4">사용자명</th>
            <th scope="col" className="w-[190px] px-4 py-4">상품명</th>
            <th scope="col" className="w-[130px] px-4 py-4">취소 요청일</th>
            <th scope="col" className="px-4 py-4">환불 사유</th>
            <th scope="col" className="w-[150px] px-4 py-4">현재 상태</th>
            <th scope="col" className="w-[230px] px-4 py-4">관리</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-[14px] text-[#667085]">
                환불 요청을 불러오는 중입니다...
              </td>
            </tr>
          ) : refunds.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-[14px] text-[#667085]">
                조건에 맞는 환불 요청이 없습니다.
              </td>
            </tr>
          ) : (
            refunds.map((refund) => (
              <CsRefundRow
                key={refund.refundId}
                refund={refund}
                processingId={processingId}
                onAction={onAction}
              />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
