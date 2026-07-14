"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/features/friends/components/FriendPanel";
import {
  DUMMY_TODAY,
  getReservationsWithSessionState,
  markReservationRefundRequested,
} from "./reservation.data";
import { ReservationItem, ReservationTab } from "./reservation.types";
import ReservationCard from "./ReservationCard";
import RefundRequestModal from "./RefundRequestModal";

const TABS: { value: ReservationTab; label: string }[] = [
  { value: "upcoming", label: "이용 전" },
  { value: "completed", label: "이용 후" },
  { value: "refund", label: "환불 내역" },
];

const REFUND_STATUSES = ["refund_pending", "refunded", "refund_rejected"];

// 마이페이지 예약 내역 화면 (디자인 확인용 더미 데이터, API 연동 없음)
// 예약 상세는 모달이 아니라 별도 페이지(/mypage/reservations/[reservationId])에서 확인한다
export default function ReservationPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>(() =>
    getReservationsWithSessionState()
  );
  const [activeTab, setActiveTab] = useState<ReservationTab>("upcoming");
  const [refundTarget, setRefundTarget] = useState<ReservationItem | null>(
    null
  );

  const grouped = useMemo(
    () => ({
      upcoming: reservations.filter((item) => item.status === "reserved"),
      completed: reservations.filter((item) => item.status === "completed"),
      refund: reservations.filter((item) =>
        REFUND_STATUSES.includes(item.status)
      ),
    }),
    [reservations]
  );

  const visibleList = grouped[activeTab];

  const handleConfirmRefund = (reason: string) => {
    if (!refundTarget) return;

    markReservationRefundRequested(refundTarget.id, reason);

    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === refundTarget.id
          ? {
              ...reservation,
              status: "refund_pending",
              refundReason: reason,
              refundRequestedAt: DUMMY_TODAY,
              refundRejectedReason: undefined,
              refundRejectedAt: undefined,
              refundedAt: undefined,
            }
          : reservation
      )
    );

    setRefundTarget(null);
    setActiveTab("refund");
  };

  // 잔금 결제는 디자인만 구현 (실제 결제 기능은 다음 단계에서 연결)
  const handlePayBalance = (reservation: ReservationItem) => {
    console.log("잔금 결제하기(디자인 전용):", reservation.reservationNumber);
  };

  return (
    <div>
      {/* 탭 */}
      <div className="flex gap-6 border-b border-[#E5EDF5]">
        {TABS.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${
                isActive
                  ? "border-[#439A97] text-[#439A97]"
                  : "border-transparent text-[#0A1628] hover:text-[#439A97]"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  isActive
                    ? "bg-[#EEF8F7] text-[#439A97]"
                    : "bg-[#F3F8FC] text-[#8A9BB0]"
                }`}
              >
                {grouped[tab.value].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 목록 */}
      <div className="mt-4 space-y-3">
        {visibleList.length === 0 ? (
          <div className="rounded-2xl border border-[#E5EDF5] bg-white py-6 shadow-sm">
            {activeTab === "upcoming" && (
              <EmptyState
                title="예정된 예약이 없습니다."
                description="새로운 여행 패키지를 둘러보세요."
              />
            )}
            {activeTab === "completed" && (
              <EmptyState title="이용 완료된 예약이 없습니다." />
            )}
            {activeTab === "refund" && (
              <EmptyState title="환불 내역이 없습니다." />
            )}
          </div>
        ) : (
          visibleList.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onRefundRequest={setRefundTarget}
              onPayBalance={handlePayBalance}
            />
          ))
        )}
      </div>

      {/* 환불 요청 모달 (예약마다 입력값이 남지 않도록 key로 매번 새로 마운트한다) */}
      {refundTarget && (
        <RefundRequestModal
          key={refundTarget.id}
          reservation={refundTarget}
          onCancel={() => setRefundTarget(null)}
          onConfirm={handleConfirmRefund}
        />
      )}
    </div>
  );
}
