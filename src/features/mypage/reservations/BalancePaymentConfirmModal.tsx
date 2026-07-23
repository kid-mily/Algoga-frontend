"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyCoupons, getMyMileages } from "@/features/services/myBenefit.service";
import { getCouponDiscount, normalizeMileageInput } from "@/features/payment/utils";
import type { MyCoupon } from "@/features/mypage/benefits/components/types";

interface BalancePaymentConfirmModalProps {
  // 잔금 원금(할인 전 balancePrice)
  amount: number;
  dueDate?: string;
  isPaying: boolean;
  onCancel: () => void;
  // 2026-07-23 정책 변경 — 잔금(2차) 결제는 쿠폰·마일리지 둘 다 사용 가능해져서, 선택한 값을 그대로 넘긴다
  onConfirm: (usedMileage: number, usedCouponId: number | null) => void;
}

// 잔금(2차) 결제 확인 모달. 쿠폰/마일리지 선택 후 실제 결제 금액을 계산해 보여준다
export default function BalancePaymentConfirmModal({
  amount,
  dueDate,
  isPaying,
  onCancel,
  onConfirm,
}: BalancePaymentConfirmModalProps) {
  const [coupons, setCoupons] = useState<MyCoupon[]>([]);
  const [mileageBalance, setMileageBalance] = useState(0);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(true);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [mileageInputValue, setMileageInputValue] = useState("");
  const [usedMileage, setUsedMileage] = useState(0);

  useEffect(() => {
    let active = true;

    const loadBenefits = async () => {
      const [couponResult, mileageResult] = await Promise.allSettled([
        getMyCoupons(),
        getMyMileages(),
      ]);

      if (!active) return;

      if (couponResult.status === "fulfilled") {
        setCoupons(
          couponResult.value.filter(
            (coupon) => coupon.status === "ISSUED" && coupon.usable
          )
        );
      } else {
        console.error("[mypage] 잔금 결제 쿠폰 조회 실패:", couponResult.reason);
      }

      if (mileageResult.status === "fulfilled") {
        setMileageBalance(mileageResult.value.totalMileage ?? 0);
      } else {
        console.error("[mypage] 잔금 결제 마일리지 조회 실패:", mileageResult.reason);
      }

      setIsLoadingBenefits(false);
    };

    void loadBenefits();

    return () => {
      active = false;
    };
  }, []);

  const selectedCoupon = useMemo(
    () =>
      coupons.find((coupon) => coupon.userCouponId === selectedCouponId) ??
      null,
    [coupons, selectedCouponId]
  );

  const couponDiscount = useMemo(
    () => getCouponDiscount(selectedCoupon, amount),
    [selectedCoupon, amount]
  );

  const maxMileage = useMemo(
    () => Math.min(mileageBalance, Math.max(amount - couponDiscount, 0)),
    [mileageBalance, amount, couponDiscount]
  );

  const finalAmount = useMemo(
    () => Math.max(amount - couponDiscount - usedMileage, 0),
    [amount, couponDiscount, usedMileage]
  );

  // maxMileage는 쿠폰이 바뀔 때만 변하고, 쿠폰이 바뀌면 handleCouponChange가 usedMileage를
  // 항상 0으로 리셋하므로 usedMileage가 maxMileage를 넘어설 일이 없다 (별도 clamp effect 불필요)
  const handleCouponChange = (couponId: number | null) => {
    setSelectedCouponId(couponId);
    // 쿠폰이 바뀌면 결제 금액이 바뀌므로 적용된 마일리지 초기화
    setUsedMileage(0);
    setMileageInputValue("");
  };

  const handleApplyMileage = () => {
    const nextMileage = normalizeMileageInput(mileageInputValue, maxMileage);
    setUsedMileage(nextMileage);
    setMileageInputValue(String(nextMileage));
  };

  const handleUseAllMileage = () => {
    const nextMileage = normalizeMileageInput(String(maxMileage), maxMileage);
    setUsedMileage(nextMileage);
    setMileageInputValue(String(nextMileage));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="balance-payment-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="balance-payment-title" className="text-lg font-extrabold text-[#0A1628]">
          잔금을 결제할까요?
        </h2>
        <p className="mt-2 text-sm text-[#718096]">
          쿠폰·마일리지를 적용한 뒤 결제가 진행됩니다.
        </p>

        <div className="mt-4">
          <label className="text-xs font-bold text-[#0A1628]">할인 쿠폰</label>
          <select
            value={selectedCouponId ?? ""}
            disabled={isLoadingBenefits || isPaying}
            onChange={(event) =>
              handleCouponChange(
                event.target.value ? Number(event.target.value) : null
              )
            }
            className="mt-1.5 h-11 w-full rounded-xl border border-[#E1E8EF] bg-[#FAFCFE] px-3 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#439A97] focus:bg-white disabled:cursor-not-allowed disabled:bg-[#F3F8FC] disabled:text-[#A0AEC0]"
          >
            <option value="">쿠폰 선택 안 함</option>
            {coupons.map((coupon) => (
              <option key={coupon.userCouponId} value={coupon.userCouponId}>
                {coupon.couponName}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0A1628]">마일리지</label>
            <span className="text-xs text-[#8A9BB0]">
              보유 {mileageBalance.toLocaleString()}원
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_56px_64px] gap-1.5">
            <input
              type="number"
              min={0}
              max={maxMileage}
              value={mileageInputValue}
              disabled={isLoadingBenefits || isPaying}
              onChange={(event) => setMileageInputValue(event.target.value)}
              className="h-11 rounded-xl border border-[#E1E8EF] bg-[#FAFCFE] px-3 text-sm outline-none transition focus:border-[#439A97] focus:bg-white disabled:cursor-not-allowed disabled:bg-[#F3F8FC]"
            />
            <button
              type="button"
              onClick={handleUseAllMileage}
              disabled={isLoadingBenefits || isPaying}
              className="h-11 rounded-xl border border-[#B7DAD7] bg-white text-xs font-bold text-[#357F7C] transition hover:bg-[#F6FBFA] disabled:cursor-not-allowed disabled:opacity-50"
            >
              전액
            </button>
            <button
              type="button"
              onClick={handleApplyMileage}
              disabled={isLoadingBenefits || isPaying}
              className="h-11 rounded-xl bg-[#439A97] text-xs font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              적용
            </button>
          </div>
          <p className="mt-1 text-xs text-[#8A9BB0]">
            최대 {maxMileage.toLocaleString()}원까지 사용할 수 있습니다.
          </p>
        </div>

        <div className="mt-5 rounded-xl bg-[#EEF8F7] p-4">
          <div className="flex items-center justify-between text-xs text-[#56706F]">
            <span>잔금</span>
            <span>{amount.toLocaleString()}원</span>
          </div>
          {couponDiscount > 0 && (
            <div className="mt-1 flex items-center justify-between text-xs text-[#56706F]">
              <span>쿠폰 할인</span>
              <span>-{couponDiscount.toLocaleString()}원</span>
            </div>
          )}
          {usedMileage > 0 && (
            <div className="mt-1 flex items-center justify-between text-xs text-[#56706F]">
              <span>마일리지 사용</span>
              <span>-{usedMileage.toLocaleString()}원</span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#B7DAD7] pt-2">
            <span className="text-sm font-bold text-[#0A1628]">결제 금액</span>
            <strong className="text-xl text-[#439A97]">
              {finalAmount.toLocaleString()}원
            </strong>
          </div>
          {dueDate && (
            <p className="mt-2 text-xs text-[#56706F]">결제 기한 {dueDate}</p>
          )}
        </div>

        <p className="mt-4 text-xs leading-5 text-[#718096]">
          결제를 완료하면 예약이 ‘전액 결제 완료’ 상태로 변경됩니다.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPaying}
            className="rounded-xl border border-[#E1E8EF] py-3 text-sm font-bold text-[#718096] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onConfirm(usedMileage, selectedCouponId)}
            disabled={isPaying || isLoadingBenefits}
            className="rounded-xl bg-[#439A97] py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {isPaying ? "결제 처리 중..." : "결제하기"}
          </button>
        </div>
      </section>
    </div>
  );
}
