import { CsRefund } from "../types";
import RefundStatusBadge from "./RefundStatusBadge";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#667085]">{label}</span>
      <span className="font-bold text-[#111827]">{value}</span>
    </div>
  );
}

const getDaysUntilUseDate = (useDate: string) => {
  const target = new Date(useDate);

  if (!useDate || Number.isNaN(target.getTime())) {
    return "정보 없음";
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.ceil(
    (targetStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  return `${diffDays}일`;
};

export default function RefundSidePanel({ refund }: { refund: CsRefund }) {
  const daysUntilUseDate = getDaysUntilUseDate(refund.useDate);

  return (
    <aside className="space-y-6">
      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <header className="border-b border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4">
          <h2 className="text-[16px] font-bold text-[#111827]">사용자 정보</h2>
        </header>

        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#6FA8A5] text-[18px] font-bold text-white">
              {refund.user.charAt(0)}
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#111827]">{refund.user}</p>
              <p className="text-[13px] text-[#667085]">{refund.userLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <header className="border-b border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4">
          <h2 className="text-[16px] font-bold text-[#111827]">처리 현황</h2>
        </header>

        <div className="space-y-4 p-5 text-[14px]">
          <Row label="취소 요청 일시" value={refund.requestDateTime} />

          <div className="flex items-center justify-between">
            <span className="text-[#667085]">현재 상태</span>
            <RefundStatusBadge status={refund.status} />
          </div>

          {refund.status === "반려" && refund.rejectReason && (
            <div>
              <p className="mb-2 text-[13px] font-semibold text-[#667085]">반려 사유</p>
              <p className="rounded-[10px] bg-[#F9FAFB] px-4 py-3 text-[13px] text-[#344054]">
                {refund.rejectReason}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[16px] border border-[#BBF7D0] bg-gradient-to-r from-[#DDF5DE] to-[#F3FBFB] p-5">
        <h2 className="mb-4 text-[16px] font-bold text-[#111827]">환불 정책</h2>
        <p className="mb-3 text-[12px] font-semibold text-[#B54747]">
          예약금(계약금)과 강의는 환불되지 않습니다. 잔금만 아래 기준으로 환불됩니다.
        </p>
        <div className="space-y-2 text-[13px] font-semibold text-[#344054]">
          <p>· 출발 14일 전까지: 잔금 100% 환불</p>
          <p>· 출발 7~13일 전: 잔금 50% 환불</p>
          <p>· 출발 7일 미만: 환불 불가</p>
        </div>
        <div className="my-4 border-t border-[#9ACBC7]" />
        <p className="text-[13px] text-[#439A97]">
          현재 출발일까지: {daysUntilUseDate}
        </p>
      </section>
    </aside>
  );
}
