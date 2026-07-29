"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/features/friends/components/FriendPanel";
import {
  loadMyReservations,
  payReservationBalance,
  submitRefundRequest,
} from "./reservation.util";
import { ReservationItem, ReservationTab } from "./reservation.types";
import ReservationCard from "./ReservationCard";
import RefundRequestModal from "./RefundRequestModal";
import BalancePaymentConfirmModal from "./BalancePaymentConfirmModal";

const TABS: { value: ReservationTab; label: string }[] = [
  { value: "upcoming", label: "이용 전" },
  { value: "completed", label: "이용 후" },
  { value: "refund", label: "환불 내역" },
];

const REFUND_STATUSES = ["refund_pending", "refunded", "refund_rejected"];

// 마이페이지 예약 내역 화면 (이용 전/이용 후/환불 내역 전부 실제 API 데이터)
export default function ReservationPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<ReservationTab>("upcoming");
  const [refundTarget, setRefundTarget] = useState<ReservationItem | null>(
    null
  );
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [refundErrorMessage, setRefundErrorMessage] = useState("");
  const [payingBalanceId, setPayingBalanceId] = useState<number | null>(null);
  const [balanceErrorMessage, setBalanceErrorMessage] = useState("");
  const [balanceTarget, setBalanceTarget] = useState<ReservationItem | null>(null);
  const [balanceSuccessMessage, setBalanceSuccessMessage] = useState("");

  // 예약 목록은 로그인 유저 전용 데이터라 서버가 아니라 여기(클라이언트)에서 직접 불러온다
  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const myReservations = await loadMyReservations();
        if (!active) return;

        setReservations(myReservations);
      } catch (error) {
        if (!active) return;
        console.error("[mypage] 예약 내역 조회 실패:", error);
        setLoadErrorMessage("예약 내역을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

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

  const handleConfirmRefund = async (reason: string) => {
    if (!refundTarget) return;

    setIsSubmittingRefund(true);
    setRefundErrorMessage("");

    try {
      await submitRefundRequest(refundTarget.id, reason);

      setRefundTarget(null);
      setActiveTab("refund");

      // 취소/환불 요청 반영 후의 실제 서버 상태로 목록을 다시 불러온다
      const myReservations = await loadMyReservations();
      setReservations(myReservations);
    } catch (error) {
      console.error("[mypage] 환불 요청 실패:", error);
      setRefundErrorMessage(
        error instanceof Error ? error.message : "환불 요청에 실패했습니다."
      );
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const handlePayBalance = async (
    reservation: ReservationItem,
    amount: number,
    usedMileage: number,
    usedCouponId: number | null
  ) => {
    if (payingBalanceId !== null) return;

    setPayingBalanceId(reservation.id);
    setBalanceErrorMessage("");
    setBalanceSuccessMessage("");

    try {
      await payReservationBalance(
        reservation.id,
        amount,
        usedMileage,
        usedCouponId
      );
      setReservations(await loadMyReservations());
      setBalanceSuccessMessage(
        `잔금 ${amount.toLocaleString()}원 결제가 완료되었습니다.`
      );
      setBalanceTarget(null);
    } catch (error) {
      setBalanceErrorMessage(
        error instanceof Error ? error.message : "잔금 결제에 실패했습니다."
      );
    } finally {
      setPayingBalanceId(null);
    }
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
      {balanceErrorMessage && (
        <p className="mt-4 rounded-xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B54747]">
          {balanceErrorMessage}
        </p>
      )}
      {balanceSuccessMessage && (
        <p className="mt-4 rounded-xl border border-[#B7DAD7] bg-[#EEF8F7] px-4 py-3 text-sm text-[#287A76]">
          {balanceSuccessMessage}
        </p>
      )}
      <div className="mt-4 space-y-3">
        {isLoading && activeTab !== "refund" ? (
          <div className="rounded-2xl border border-[#E5EDF5] bg-white py-6 text-center text-sm text-[#8A9BB0] shadow-sm">
            예약 내역을 불러오는 중입니다...
          </div>
        ) : loadErrorMessage && activeTab !== "refund" ? (
          <div className="rounded-2xl border border-[#E5EDF5] bg-white py-6 text-center text-sm text-[#B54747] shadow-sm">
            {loadErrorMessage}
          </div>
        ) : visibleList.length === 0 ? (
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
              onRefundRequest={(target) => {
                setRefundErrorMessage("");
                setRefundTarget(target);
              }}
              onPayBalance={(target) => {
                setBalanceErrorMessage("");
                setBalanceSuccessMessage("");
                setBalanceTarget(target);
              }}
            />
          ))
        )}
      </div>

      {/* 환불 요청 모달 (예약마다 입력값이 남지 않도록 key로 매번 새로 마운트한다) */}
      {refundTarget && (
        <RefundRequestModal
          key={refundTarget.id}
          reservation={refundTarget}
          onCancel={() => {
            setRefundTarget(null);
            setRefundErrorMessage("");
          }}
          onConfirm={handleConfirmRefund}
          isSubmitting={isSubmittingRefund}
          errorMessage={refundErrorMessage}
        />
      )}
      {balanceTarget && (
        <BalancePaymentConfirmModal
          amount={balanceTarget.remainingAmount}
          dueDate={balanceTarget.balanceDueDate}
          isPaying={payingBalanceId === balanceTarget.id}
          onCancel={() => setBalanceTarget(null)}
          onConfirm={(amount, usedMileage, usedCouponId) =>
            void handlePayBalance(balanceTarget, amount, usedMileage, usedCouponId)
          }
        />
      )}
    </div>
  );
}
