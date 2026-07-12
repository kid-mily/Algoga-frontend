"use client";

import Link from "next/link";
import type { PackageDetailData } from "../packageDetail.types";

interface PaymentSummaryProps {
  data: PackageDetailData;
  packageId: string;
  productAmount: number;
  couponDiscount: number;
  usedMileage: number;
  finalAmount: number;
  isPaying: boolean;
  onPay: () => void;
}

// 결제 페이지 오른쪽 카드: 예약 정보 + 요금 상세 + 결제 버튼
export default function PaymentSummary({
  data,
  packageId,
  productAmount,
  couponDiscount,
  usedMileage,
  finalAmount,
  isPaying,
  onPay,
}: PaymentSummaryProps) {
  const outboundFlight = data.flights[0];
  const canPay = !isPaying && Number.isFinite(finalAmount) && finalAmount >= 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.08)]">
      <div className="p-10 sm:p-6">
        <h2 className="mt-1 text-base font-extrabold text-[#0A1628] pt-2 py-2">
          {data.title}
        </h2>

        <div className="mt-3 space-y-1 border-t border-dashed border-[#D6E0E8] pt-3 text-xs text-[#718096]">
          {outboundFlight && (
            <p>
              {data.airline} {outboundFlight.flightNumber} ·{" "}
              {outboundFlight.departureAirport} →{" "}
              {outboundFlight.arrivalAirport}
            </p>
          )}
          <p>{data.accommodation.name}</p>
        </div>
      </div>

      {/* 절취선 */}
      <div className="relative">
        <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F3F8FC]" />
        <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F3F8FC]" />
        <div className="border-t-2 border-dashed border-[#D6E0E8]" />
      </div>

      {/* 하단: 요금 상세 + 결제 */}
      <div className="p-5 sm:p-6">
        <div className="space-y-2 font-mono text-sm text-[#0A1628]">
          <div className="flex items-center justify-between">
            <span className="font-sans">강의</span>
            <span className="font-bold">
              {data.booking.flightPrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans">항공권</span>
            <span className="font-bold">
              {data.booking.flightPrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans">숙소</span>
            <span className="font-bold">
              {data.booking.stayPrice.toLocaleString()}원
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-[#D6E0E8] pt-2">
            <span className="font-sans">상품 금액</span>
            <span className="font-bold">
              {productAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans">쿠폰 할인</span>
            <span className="font-bold text-[#B54747]">
              -{couponDiscount.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans">마일리지 사용</span>
            <span className="font-bold text-[#B54747]">
              -{usedMileage.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#EEF8F7] p-4">
          <span className="text-sm font-bold text-[#0A1628]">
            총 결제 금액
          </span>
          <span className="font-mono text-lg font-extrabold text-[#439A97]">
            {finalAmount.toLocaleString()}원
          </span>
        </div>

        <button
          type="button"
          onClick={onPay}
          disabled={!canPay}
          className="mt-4 w-full rounded-xl bg-[#439A97] py-3 text-sm font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPaying
            ? "결제 요청 중..."
            : `토스페이로 ${finalAmount.toLocaleString()}원 결제하기`}
        </button>

        <button
          type="button"
          className="mt-3 w-full text-center text-xs font-medium text-[#8A9BB0] transition hover:text-[#718096]"
        >
          환불 정책 확인하기
        </button>
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-[#718096]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[#0A1628]">{value}</p>
    </div>
  );
}
