import { CsRefund } from "../types";

const formatWon = (value: number) => `${value.toLocaleString()}원`;

function Info({
  label,
  value,
  teal,
  big,
}: {
  label: string;
  value: string;
  teal?: boolean;
  big?: boolean;
}) {
  return (
    <div>
      <dt className="mb-2 text-[13px] font-semibold text-[#667085]">{label}</dt>
      <dd
        className={`font-bold ${
          teal
            ? "text-[#439A97]"
            : big
              ? "text-[20px] text-[#111827]"
              : "text-[#111827]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function RefundReservationSection({ refund }: { refund: CsRefund }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="flex items-center gap-2 bg-gradient-to-r from-[#DDF5DE] to-[#F3FBFB] px-6 py-5">
        <span className="text-[#439A97]" aria-hidden="true">■</span>
        <h2 className="text-[18px] font-bold text-[#111827]">예약 정보</h2>
      </header>

      <dl className="grid grid-cols-2 gap-y-6 px-6 py-6">
        <Info label="예약번호" value={refund.bookingId} teal />
        <Info label="상품명" value={refund.product} />
        <Info label="예약자명" value={refund.user} />
        <Info label="예약일" value={refund.bookingCreatedAt.substring(0, 10)} />
        <Info label="이용 예정일" value={refund.useDate} />
        <Info label="결제 금액" value={formatWon(refund.paymentAmount)} big />
        <Info label="결제 수단" value={refund.paymentMethod} />
        <Info label="결제 일시" value={refund.paymentCreatedAt} />
      </dl>
    </section>
  );
}

export function RefundCancelSection({ refund }: { refund: CsRefund }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="flex items-center gap-2 bg-gradient-to-r from-[#FFF7ED] to-[#FFF1F2] px-6 py-5">
        <span className="text-[#F97316]" aria-hidden="true">■</span>
        <h2 className="text-[18px] font-bold text-[#111827]">취소 요청 정보</h2>
      </header>

      <dl className="space-y-5 px-6 py-6">
        <Info label="취소 요청자" value={`${refund.user} (${refund.userLabel})`} />
        <Info label="취소 요청 일시" value={refund.requestDateTime} />
        <div>
          <dt className="mb-2 text-[13px] font-semibold text-[#667085]">
            취소 사유
          </dt>
          <dd className="rounded-[10px] bg-[#F9FAFB] px-4 py-4 text-[14px] text-[#344054]">
            {refund.reason}
          </dd>
        </div>
      </dl>
    </section>
  );
}
