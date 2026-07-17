"use client";

import { useState } from "react";
import Link from "next/link";
import type { PackageBookingInfo } from "../packageDetail.types";
import { buildQueryString } from "../utils/query";

interface PackageBookingSummaryProps {
  booking: PackageBookingInfo;
  packageId: string;
  courseId?: string;
  continentCode?: string;
}

type PaymentMethod = "분할 결제" | "일시불";

// 오른쪽 예약 요약 카드: 가격 정보 + 결제 방식 선택 + 예약하기 버튼
export default function PackageBookingSummary({
  booking,
  packageId,
  courseId,
  continentCode,
}: PackageBookingSummaryProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("분할 결제");
  // 예약 페이지가 패키지를 다시 조회할 때 자기 countryId를 직접 얻으므로 여기서는 courseId만 이어주면 된다
  const bookingHref = `/packagelounge/${packageId}/booking${buildQueryString({ courseId, continentCode })}`;

  return (
    <div className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.08)]">
      <h2 className="text-sm font-bold text-[#0A1628]">예약 요약</h2>
      <p className="mt-2 text-sm font-bold text-[#0A1628]">{booking.title}</p>
      <p className="mt-1 text-xs text-[#718096]">
        {booking.dateRange} · {booking.duration}
      </p>

      <div className="mt-4 space-y-2 border-t border-[#E1E8EF] pt-4">
        <div className="flex items-center justify-between text-sm text-[#0A1628]">
          <span>항공권</span>
          <span className="font-bold">
            {booking.flightPrice.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-[#0A1628]">
          <span>숙소</span>
          <span className="font-bold">
            {booking.stayPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-[#E1E8EF] pt-4">
        <p className="text-xs font-bold text-[#0A1628]">결제 방식</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["분할 결제", "일시불"] as const).map((method) => {
            const isActive = method === paymentMethod;

            return (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`rounded-lg py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-[#439A97] text-white"
                    : "border border-[#E1E8EF] bg-white text-[#0A1628]"
                }`}
              >
                {method}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[#EEF8F7] p-4">
        {paymentMethod === "분할 결제" ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#718096]">지금 결제(예약금)</span>
              <span className="text-lg font-extrabold text-[#439A97]">
                {booking.depositAmount.toLocaleString()}원
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#718096]">
              잔금 {booking.balanceAmount.toLocaleString()}원은 출발 7일
              전까지 별도 결제
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#718096]">총 결제 금액</span>
            <span className="text-lg font-extrabold text-[#439A97]">
              {booking.totalAmount.toLocaleString()}원
            </span>
          </div>
        )}
      </div>

      {booking.canBook ? (
        <Link
          href={bookingHref}
          className="mt-4 block w-full rounded-xl bg-[#439A97] py-3 text-center text-sm font-bold text-white transition hover:bg-[#377F7C]"
        >
          예약하기
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-4 block w-full cursor-not-allowed rounded-xl bg-[#B8C8C7] py-3 text-center text-sm font-bold text-white"
        >
          예약하기
        </button>
      )}

      {!booking.canBook && (
        <p className="mt-3 text-center text-[11px] text-[#B54747]">
          항공편 정보를 불러오지 못해 지금은 예약할 수 없습니다. 잠시 후
          다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
