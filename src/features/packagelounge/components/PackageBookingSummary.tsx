import Link from "next/link";
import type { PackageBookingInfo } from "../packageDetail.types";
import { buildQueryString } from "../utils/query";

interface PackageBookingSummaryProps {
  booking: PackageBookingInfo;
  packageId: string;
  courseId?: string;
  continentCode?: string;
}

// 오른쪽 예약 요약 카드: 일정 정보 + 예약하기 버튼.
// 실제 금액은 강의 포함 여부와 예약 생성 결과에 따라 달라지므로 예약 페이지에서만 보여준다.
export default function PackageBookingSummary({
  booking,
  packageId,
  courseId,
  continentCode,
}: PackageBookingSummaryProps) {
  // 예약 페이지가 패키지를 다시 조회할 때 자기 countryId를 직접 얻으므로 여기서는 courseId만 이어주면 된다
  const bookingHref = `/packagelounge/${packageId}/booking${buildQueryString({ courseId, continentCode })}`;

  return (
    <div className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.08)]">
      <h2 className="text-sm font-bold text-[#0A1628]">예약 요약</h2>
      <p className="mt-2 text-sm font-bold text-[#0A1628]">{booking.title}</p>
      <p className="mt-1 text-xs text-[#718096]">
        {booking.dateRange} · {booking.duration}
      </p>

      <p className="mt-4 border-t border-[#E1E8EF] pt-4 text-xs leading-5 text-[#718096]">
        강의 포함 여부와 결제 방식이 반영된 최종 금액은 예약 페이지에서
        확인할 수 있습니다.
      </p>

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
