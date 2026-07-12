"use client";

import { useRouter } from "next/navigation";
import type { PackageDetailData } from "../packageDetail.types";

interface BookingPriceProps {
  data: PackageDetailData;
  packageId: string;
  // 탑승객 정보 필수 항목이 모두 채워졌는지 여부
  isPassengerValid: boolean;
  // 취소/환불 규정에 동의했는지 여부
  isAgreed: boolean;
  // 탑승객 정보가 비어 있는 채로 버튼을 눌렀을 때 호출 (탑승객 정보 쪽에 오류를 보여주기 위함)
  onInvalidAttempt: () => void;
  // 규정에 동의하지 않은 채로 버튼을 눌렀을 때 호출 (동의 체크박스 쪽에 오류를 보여주기 위함)
  onPolicyInvalidAttempt: () => void;
}

// 예약 요약 + 결제 금액 영역 (오른쪽 사이드 카드).
// 버튼은 항상 눌러볼 수 있고, 탑승객 정보가 비어 있거나 규정에 동의하지 않았으면 그쪽으로 안내한다
export default function BookingPrice({
  data,
  packageId,
  isPassengerValid,
  isAgreed,
  onInvalidAttempt,
  onPolicyInvalidAttempt,
}: BookingPriceProps) {
  const router = useRouter();
  const { booking } = data;

  const handleClick = () => {
    if (!isPassengerValid) {
      onInvalidAttempt();
      return;
    }

    if (!isAgreed) {
      onPolicyInvalidAttempt();
      return;
    }

    router.push(`/packagelounge/${packageId}/payment`);
  };

  return (
    <div className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.08)] sm:p-6">
      <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
        BOOKING SUMMARY
      </span>
      <h2 className="mt-1 text-lg font-bold text-[#0A1628]">예약 요약</h2>

      <p className="mt-3 text-sm font-bold text-[#0A1628]">{booking.title}</p>
      <p className="mt-1 text-xs text-[#718096]">{booking.dateRange}</p>
      <p className="mt-0.5 text-xs text-[#718096]">
        {booking.duration} · {data.maxPeople}
      </p>

      <div className="mt-4 space-y-2 border-t border-[#E1E8EF] pt-4">
        <div className="flex items-center justify-between text-sm text-[#0A1628]">
          <span>항공권</span>
          <span className="font-bold">
            {booking.flightPrice.toLocaleString()}원
          </span>
        </div>
        <div className="border-t border-dashed border-[#D6E0E8]" />
        <div className="flex items-center justify-between text-sm text-[#0A1628]">
          <span>숙소</span>
          <span className="font-bold">
            {booking.stayPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#EEF8F7] p-4">
        <span className="text-sm font-bold text-[#0A1628]">총 결제 금액</span>
        <span className="text-lg font-extrabold text-[#439A97]">
          {booking.totalAmount.toLocaleString()}원
        </span>
      </div>

      <p className="mt-3 text-xs text-[#718096]">
        쿠폰과 마일리지는 다음 단계에서 적용할 수 있습니다.
      </p>

      <button
        type="button"
        onClick={handleClick}
        className="mt-4 w-full rounded-xl bg-[#439A97] py-3 text-center text-sm font-bold text-white transition hover:bg-[#357F7C]"
      >
        결제 단계로 이동
      </button>
    </div>
  );
}
