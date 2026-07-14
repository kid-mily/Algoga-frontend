import Link from "next/link";
import {
  RESERVATION_STATUS_BADGE_CLASS,
  RESERVATION_STATUS_LABEL,
  ReservationItem,
} from "./reservation.types";

interface ReservationCardProps {
  reservation: ReservationItem;
  onRefundRequest: (reservation: ReservationItem) => void;
  onPayBalance: (reservation: ReservationItem) => void;
}

// 디데이
const getDDayLabel = (startDate: string) => {
  const today = new Date();
  const target = new Date(startDate.replaceAll(".", "-"));
  const diffDays = Math.ceil(
    (target.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return null;
  if (diffDays === 0) return "출발 당일";
  return `출발까지 D-${diffDays}`;
};

// 예약 한 건을 보여주는 카드
export default function ReservationCard({
  reservation,
  onRefundRequest,
  onPayBalance,
}: ReservationCardProps) {
  const isReserved = reservation.status === "reserved";
  const isRefundState =
    reservation.status === "refund_pending" ||
    reservation.status === "refunded" ||
    reservation.status === "refund_rejected";

  const canPayBalance =
    reservation.paymentType === "installment" &&
    reservation.remainingAmount > 0 &&
    isReserved;

  const dDayLabel = isReserved ? getDDayLabel(reservation.startDate) : null;

  return (
    <article className="rounded-2xl border border-[#E5EDF5] bg-white p-4 shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition-all hover:-translate-y-0.5 hover:border-[#B7DAD7] hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]">
      {/* 상단: 상태 배지 + 예약 번호 / D-day */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${RESERVATION_STATUS_BADGE_CLASS[reservation.status]}`}
        >
          {RESERVATION_STATUS_LABEL[reservation.status]}
        </span>

        <div className="flex items-center gap-2">
          {dDayLabel && (
            <span className="rounded-full bg-[#EEF8F7] px-2 py-0.5 text-[11px] font-bold text-[#439A97]">
              {dDayLabel}
            </span>
          )}
          <span className="text-xs text-[#8A9BB0]">
            {reservation.reservationNumber}
          </span>
        </div>
      </div>

      {/* 가운데: 패키지명 + 여행 기간 */}
      <div className="mt-2">
        <h3 className="text-sm font-extrabold text-[#0A1628]">
          {reservation.packageName}
        </h3>
        <p className="mt-0.5 text-xs text-[#8A9BB0]">
          {reservation.destination} · {reservation.duration}
        </p>
        <p className="text-xs text-[#0A1628]">
          {reservation.startDate} ~ {reservation.endDate}
        </p>
      </div>

      {/* 항공권 / 숙소 요약 */}
      <div className="mt-3 grid grid-cols-1 gap-2 border-t border-dashed border-[#D6E0E8] pt-3 text-xs sm:grid-cols-2">
        <p>
          <span className="text-[#8A9BB0]">항공권 </span>
          <span className="font-bold text-[#0A1628]">
            {reservation.airline} {reservation.flightNumber}
          </span>
        </p>
        <p>
          <span className="text-[#8A9BB0]">숙소 </span>
          <span className="font-bold text-[#0A1628]">
            {reservation.accommodationName}
          </span>
        </p>
      </div>

      {/* 결제/환불 정보 */}
      {!isRefundState ? (
        <div className="mt-3 rounded-xl bg-[#F8FBFD] p-3 text-xs">
          {reservation.paymentType === "full" || !canPayBalance ? (
            <div className="flex items-center justify-between">
              <span className="text-[#0A1628]">총 결제 금액</span>
              <span className="font-bold text-[#439A97]">
                {reservation.totalAmount.toLocaleString()}원
              </span>
            </div>
          ) : (
            <p className="text-[#0A1628]">
              잔금{" "}
              <span className="font-bold text-[#439A97]">
                {reservation.remainingAmount.toLocaleString()}원
              </span>
              을 {reservation.balanceDueDate}까지 결제해 주세요.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-1.5 rounded-xl bg-[#F8FBFD] p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8A9BB0]">환불 요청일</span>
            <span className="font-bold text-[#0A1628]">
              {reservation.refundRequestedAt}
            </span>
          </div>
          {reservation.refundReason && (
            <p className="line-clamp-2 text-[#344054]">
              {reservation.refundReason}
            </p>
          )}
          {reservation.status === "refunded" && (
            <div className="flex items-center justify-between">
              <span className="text-[#8A9BB0]">환불 완료일</span>
              <span className="font-bold text-[#0A1628]">
                {reservation.refundedAt}
              </span>
            </div>
          )}
          {reservation.status === "refund_rejected" && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#8A9BB0]">반려일</span>
                <span className="font-bold text-[#B54747]">
                  {reservation.refundRejectedAt}
                </span>
              </div>
              {reservation.refundRejectedReason && (
                <p className="line-clamp-2 text-[#B54747]">
                  반려 사유 {reservation.refundRejectedReason}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <Link
          href={`/mypage/reservations/${reservation.id}`}
          className="rounded-xl border border-[#E5EDF5] bg-white px-3 py-1.5 text-xs font-bold text-[#0A1628] transition-colors hover:bg-[#F3F8FC]"
        >
          상세 보기
        </Link>

        {canPayBalance && (
          <button
            type="button"
            onClick={() => onPayBalance(reservation)}
            className="rounded-xl bg-[#439A97] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#357F7C]"
          >
            잔금 결제하기
          </button>
        )}

        {isReserved && (
          <button
            type="button"
            onClick={() => onRefundRequest(reservation)}
            className="rounded-xl border border-[#E5EDF5] bg-white px-3 py-1.5 text-xs font-bold text-[#B54747] transition-colors hover:bg-[#FFF1F1]"
          >
            환불 요청
          </button>
        )}
      </div>
    </article>
  );
}
