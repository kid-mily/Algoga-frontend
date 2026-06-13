import { ReactNode } from "react";
import { CsRefund } from "../types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#667085]">{label}</span>
      <span className="font-bold text-[#111827]">{value}</span>
    </div>
  );
}

function Timeline({
  title,
  time,
  desc,
  icon,
  active,
  last,
}: {
  title: string;
  time?: string;
  desc: string;
  icon?: ReactNode;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      {!last && (
        <div
          className={`absolute left-[11px] top-6 h-full w-px ${
            active ? "bg-[#BBF7D0]" : "bg-[#E4E7EC]"
          }`}
        />
      )}

      <div
        className={`z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full text-[12px] ${
          active ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#E4E7EC] text-[#98A2B3]"
        }`}
      >
        {icon || <span aria-hidden="true">●</span>}
      </div>

      <div>
        <p className={`text-[14px] font-bold ${active ? "text-[#111827]" : "text-[#98A2B3]"}`}>
          {title}
        </p>
        {time && <p className="mt-1 text-[12px] text-[#667085]">{time}</p>}
        <p className="mt-1 text-[12px] text-[#98A2B3]">{desc}</p>
      </div>
    </div>
  );
}

export default function RefundSidePanel({ refund }: { refund: CsRefund }) {
  const hasRegistered = refund.status !== "취소 요청";

  return (
    <aside className="space-y-6">
      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <header className="border-b border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4">
          <h2 className="text-[16px] font-bold text-[#111827]">사용자 정보</h2>
        </header>

        <div className="p-5">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#6FA8A5] text-[18px] font-bold text-white">
              {refund.user.charAt(0)}
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#111827]">{refund.user}</p>
              <p className="text-[13px] text-[#667085]">{refund.email}</p>
            </div>
          </div>

          <div className="space-y-4 text-[14px]">
            <Row label="총 예약" value={`${refund.totalBookings}건`} />
            <Row label="환불 이력" value={`${refund.historyCount}건`} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <header className="border-b border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4">
          <h2 className="text-[16px] font-bold text-[#111827]">처리 이력</h2>
        </header>

        <div className="p-5">
          <Timeline
            active
            icon={<span aria-hidden="true">●</span>}
            title="사용자 취소 요청 접수"
            time={refund.requestDateTime}
            desc="고객이 취소를 요청했습니다."
          />
          <Timeline
            active
            icon={<span aria-hidden="true">●</span>}
            title="CS 매니저 취소 요청 검토"
            desc="취소 요청 내용을 검토합니다."
          />
          <Timeline
            active={hasRegistered}
            icon={<span aria-hidden="true">●</span>}
            title="환불 요청 등록"
            desc="환불 요청을 등록합니다."
          />
          <Timeline title="정산 매니저 전달" desc="정산 매니저에게 전달됩니다." last />
        </div>
      </section>

      <section className="rounded-[16px] border border-[#BBF7D0] bg-gradient-to-r from-[#DDF5DE] to-[#F3FBFB] p-5">
        <h2 className="mb-4 text-[16px] font-bold text-[#111827]">환불 정책</h2>
        <div className="space-y-2 text-[13px] font-semibold text-[#344054]">
          <p>· 출발 14일 전: 100% 환불</p>
          <p>· 출발 7~13일 전: 50% 환불</p>
          <p>· 출발 6일 이내: 환불 불가</p>
        </div>
        <div className="my-4 border-t border-[#9ACBC7]" />
        <p className="text-[13px] text-[#439A97]">현재 출발일까지: 37일</p>
      </section>
    </aside>
  );
}
