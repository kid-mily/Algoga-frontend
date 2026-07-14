"use client";

import Link from "next/link";
import { useState } from "react";
import { DUMMY_TODAY, getReservationsWithSessionState, markReservationRefundRequested } from "./reservation.data";
import { PAYMENT_TYPE_LABEL, RESERVATION_STATUS_BADGE_CLASS, RESERVATION_STATUS_LABEL, ReservationItem } from "./reservation.types";
import RefundRequestModal from "./RefundRequestModal";

interface ReservationDetailProps {
  reservationId: number;
}

// 예약 상세 페이지 (디자인 확인용 더미 데이터, API 연동 없음)
export default function ReservationDetail({
  reservationId,
}: ReservationDetailProps) {
  const [reservations, setReservations] = useState<ReservationItem[]>(() =>
    getReservationsWithSessionState()
  );
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const reservation = reservations.find((item) => item.id === reservationId);

  if (!reservation) {
    return (
      <p className="rounded-2xl border border-[#E5EDF5] bg-white p-8 text-center text-sm text-[#8A9BB0] shadow-sm">
        예약 정보를 찾을 수 없습니다.
      </p>
    );
  }

  const isReserved = reservation.status === "reserved";

  const canPayBalance =
    reservation.paymentType === "installment" &&
    reservation.remainingAmount > 0 &&
    isReserved;

  const handleConfirmRefund = (reason: string) => {
    markReservationRefundRequested(reservation.id, reason);

    setReservations((prev) =>
      prev.map((item) =>
        item.id === reservation.id
          ? {
              ...item,
              status: "refund_pending",
              refundReason: reason,
              refundRequestedAt: DUMMY_TODAY,
              refundRejectedReason: undefined,
              refundRejectedAt: undefined,
              refundedAt: undefined,
            }
          : item
      )
    );

    setIsRefundModalOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* 헤더: 왼쪽 상품 정보 / 오른쪽(데스크톱) 상태·예약번호 */}
      <section className="rounded-2xl border border-[#E5EDF5] bg-[#F3FAF9] p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#0A1628]">
              {reservation.packageName}
            </h2>
            <p className="mt-1 text-xs text-[#8A9BB0]">
              {reservation.destination} · {reservation.duration}
            </p>
            <p className="mt-0.5 text-xs text-[#0A1628]">
              {reservation.startDate} ~ {reservation.endDate}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${RESERVATION_STATUS_BADGE_CLASS[reservation.status]}`}
            >
              {RESERVATION_STATUS_LABEL[reservation.status]}
            </span>
            <span className="text-xs text-[#8A9BB0]">
              예약번호 {reservation.reservationNumber}
            </span>
          </div>
        </div>
      </section>

      {/* 항공권 / 숙소 정보 */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E5EDF5] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-[#439A97]">항공권</p>
          <p className="mt-1.5 text-sm font-bold text-[#0A1628]">
            {reservation.airline} {reservation.flightNumber}
          </p>
          {reservation.departureAirport && reservation.arrivalAirport && (
            <p className="mt-1 text-xs text-[#0A1628]">
              {reservation.departureAirport} → {reservation.arrivalAirport}
            </p>
          )}
          {reservation.departureTime && (
            <p className="mt-1 text-xs text-[#8A9BB0]">
              출발 {reservation.startDate} {reservation.departureTime}
            </p>
          )}
          {reservation.arrivalTime && (
            <p className="text-xs text-[#8A9BB0]">
              도착 {reservation.startDate} {reservation.arrivalTime} 
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-[#E5EDF5] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-[#439A97]">숙소</p>
          <p className="mt-1.5 text-sm font-bold text-[#0A1628]">
            {reservation.accommodationName}
          </p>
          <p className="mt-1 text-xs text-[#0A1628]">
            체크인 {reservation.startDate} · 체크아웃 {reservation.endDate}
          </p>
        </section>
      </div>

      {/* 탑승객 정보 */}
      {reservation.passenger && (
        <section className="rounded-2xl border border-[#E5EDF5] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-[#439A97]">탑승객 정보</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <InfoField
              label="영문 이름"
              value={`${reservation.passenger.lastName} ${reservation.passenger.firstName}`}
            />
            <InfoField label="성별" value={reservation.passenger.gender} />
            <InfoField
              label="생년월일"
              value={reservation.passenger.birthDate}
            />
            <InfoField
              label="국적"
              value={reservation.passenger.nationality}
            />
            <InfoField
              label="여권 번호"
              value={reservation.passenger.passportNumber}
            />
            <InfoField
              label="여권 만료일"
              value={reservation.passenger.expiryDate}
            />
          </div>
        </section>
      )}

      {/* 결제 정보 */}
      <section className="rounded-2xl border border-[#E5EDF5] bg-white p-4 shadow-sm">
        <p className="text-xs font-bold text-[#439A97]">결제 정보</p>

        <div className="mt-2 space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#0A1628]">결제 방식</span>
            <span className="font-bold text-[#0A1628]">
              {PAYMENT_TYPE_LABEL[reservation.paymentType]}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-[#D6E0E8] pt-1.5">
            <span className="text-[#0A1628]">총 결제 금액</span>
            <span className="font-bold text-[#0A1628]">
              {reservation.totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0A1628]">결제 완료 금액</span>
            <span className="font-bold text-[#0A1628]">
              {reservation.paidAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0A1628]">남은 결제 금액</span>
            <span className="font-bold text-[#439A97]">
              {reservation.remainingAmount.toLocaleString()}원
            </span>
          </div>
          {reservation.depositPaidAt && (
            <div className="flex items-center justify-between">
              <span className="text-[#0A1628]">예약금 결제일</span>
              <span className="font-bold text-[#0A1628]">
                {reservation.depositPaidAt}
              </span>
            </div>
          )}
          {reservation.balanceDueDate && (
            <div className="flex items-center justify-between">
              <span className="text-[#0A1628]">잔금 결제 기한</span>
              <span className="font-bold text-[#0A1628]">
                {reservation.balanceDueDate}
              </span>
            </div>
          )}
        </div>

        {canPayBalance && (
          <div className="mt-3 flex flex-col gap-2 rounded-xl bg-[#F8FBFD] p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#0A1628]">
              남은 잔금{" "}
              <span className="font-bold text-[#439A97]">
                {reservation.remainingAmount.toLocaleString()}원
              </span>
              , {reservation.balanceDueDate}까지 결제해 주세요.
            </p>
            <button
              type="button"
              onClick={() =>
                console.log(
                  "잔금 결제하기(디자인 전용):",
                  reservation.reservationNumber
                )
              }
              className="rounded-xl bg-[#439A97] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#357F7C]"
            >
              잔금 결제하기
            </button>
          </div>
        )}
      </section>

      {/* 환불 요청 정보 (환불 처리 중 / 환불 완료) */}
      {(reservation.status === "refund_pending" ||
        reservation.status === "refunded") && (
        <section className="rounded-2xl border border-[#FFE1C2] bg-[#FFF8F1] p-4">
          <p className="text-xs font-bold text-[#B8631C]">환불 요청 정보</p>
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <p className="text-xs text-[#8A9BB0]">요청 일시</p>
              <p className="font-bold text-[#0A1628]">
                {reservation.refundRequestedAt}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8A9BB0]">환불 요청 사유</p>
              <p className="whitespace-pre-wrap break-words leading-6 text-[#344054]">
                {reservation.refundReason}
              </p>
            </div>
            {reservation.status === "refunded" && (
              <div>
                <p className="text-xs text-[#8A9BB0]">환불 완료일</p>
                <p className="font-bold text-[#0A1628]">
                  {reservation.refundedAt}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-[#8A9BB0]">처리 상태</p>
              <p className="font-bold text-[#0A1628]">
                {RESERVATION_STATUS_LABEL[reservation.status]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 환불 반려 안내 */}
      {reservation.status === "refund_rejected" && (
        <section className="rounded-2xl border border-[#F7C6C6] bg-[#FFF3F3] p-4">
          <p className="text-sm font-bold text-[#B54747]">
            ⚠ 환불 요청이 반려되었습니다.
          </p>

          <div className="mt-3 space-y-3 text-sm">
            <div>
              <p className="text-xs font-bold text-[#8A9BB0]">
                환불 요청 사유
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words leading-6 text-[#344054]">
                {reservation.refundReason}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#8A9BB0]">
                반려 사유
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words leading-6 text-[#B54747]">
                {reservation.refundRejectedReason}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8A9BB0]">반려 처리 일시</p>
              <p className="font-bold text-[#0A1628]">
                {reservation.refundRejectedAt}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#8A9BB0]">
            자세한 내용은 고객센터로 문의해 주세요.
          </p>
        </section>
      )}

      {/* 하단 버튼 */}
      <div className="flex flex-wrap justify-end gap-2 pt-1">
        <Link
          href="/mypage/reservations"
          className="rounded-xl border border-[#E5EDF5] bg-white px-3 py-2 text-xs font-bold text-[#0A1628] transition-colors hover:bg-[#F3F8FC]"
        >
          예약 내역으로 돌아가기
        </Link>

        {isReserved && (
          <button
            type="button"
            onClick={() => setIsRefundModalOpen(true)}
            className="rounded-xl bg-[#D95C5C] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#BF4747]"
          >
            환불 요청
          </button>
        )}
      </div>

      {isRefundModalOpen && (
        <RefundRequestModal
          key={reservation.id}
          reservation={reservation}
          onCancel={() => setIsRefundModalOpen(false)}
          onConfirm={handleConfirmRefund}
        />
      )}
    </div>
  );
}

// 라벨 + 값을 보여주는 읽기 전용 정보 칸 (탑승객 정보에서 재사용)
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E5EDF5] bg-[#F8FBFD] p-2.5">
      <p className="text-xs text-[#8A9BB0]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[#0A1628]">{value}</p>
    </div>
  );
}
