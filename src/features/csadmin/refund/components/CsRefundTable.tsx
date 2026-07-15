import Link from "next/link";
import { CsRefund } from "../types";
import CsRefundRow from "./CsRefundRow";
import RefundStatusBadge from "./RefundStatusBadge";

type CsRefundTableProps = {
  refunds: CsRefund[];
  isLoading: boolean;
};

export default function CsRefundTable({
  refunds,
  isLoading,
}: CsRefundTableProps) {
  return (
    <section
      className="rounded-[16px] border border-[#E4E7EC] bg-white"
      aria-labelledby="refund-table-title"
    >
      <h2 id="refund-table-title" className="sr-only">
        환불 요청 목록
      </h2>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-0 table-auto border-collapse">
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
              <th scope="col" className="w-[100px] px-4 py-4">요청번호</th>
              <th scope="col" className="w-[150px] px-4 py-4">예약번호</th>
              <th scope="col" className="w-[100px] px-4 py-4">사용자명</th>
              <th scope="col" className="min-w-[260px] px-4 py-4">상품명</th>
              <th scope="col" className="w-[120px] px-4 py-4">취소 요청일</th>
              <th scope="col" className="px-4 py-4">환불 사유</th>
              <th scope="col" className="w-[145px] px-4 py-4">현재 상태</th>
              <th scope="col" className="w-[96px] px-4 py-4">관리</th>
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
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {isLoading ? (
          <p className="py-8 text-center text-[14px] text-[#667085]">
            환불 요청을 불러오는 중입니다...
          </p>
        ) : refunds.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#667085]">
            조건에 맞는 환불 요청이 없습니다.
          </p>
        ) : (
          refunds.map((refund) => (
            <article
              key={refund.refundId}
              className="rounded-[12px] border border-[#E4E7EC] p-4 text-[14px] text-[#344054]"
            >
              <header className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#111827]">{refund.id}</h3>
                  <p className="mt-1 text-[13px] text-[#439A97]">{refund.bookingId}</p>
                </div>
                <RefundStatusBadge status={refund.status} />
              </header>
              <dl className="space-y-2">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#667085]">사용자</dt>
                  <dd className="font-semibold text-[#111827]">{refund.user}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#667085]">상품명</dt>
                  <dd className="text-right font-semibold text-[#111827]">{refund.product}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#667085]">요청일</dt>
                  <dd>{refund.requestedAt}</dd>
                </div>
              </dl>
              <footer className="mt-4">
                <Link
                  href={`/csadmin/refund/${refund.refundId}`}
                  aria-label={`상세 보기: 환불 ${refund.refundId}`}
                  className="inline-flex h-[36px] items-center rounded-[8px] border border-[#D0D5DD] px-3 text-[13px] font-semibold text-[#344054]"
                >
                  상세 보기
                </Link>
              </footer>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
