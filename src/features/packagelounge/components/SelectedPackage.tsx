import Image from "next/image";
import type { PackageDetailData } from "../packageDetail.types";

interface SelectedPackageProps {
  data: PackageDetailData;
}

// 결제 페이지: 사용자가 선택한 패키지 + 항공권/숙소 정보 카드
export default function SelectedPackage({ data }: SelectedPackageProps) {
  const outboundFlight = data.flights[0];

  return (
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.06)] sm:p-6">
      <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
        SELECTED PACKAGE
      </span>
      <h2 className="mt-1 text-lg font-bold text-[#0A1628]">선택한 패키지</h2>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-base font-extrabold text-[#0A1628]">
            {data.title}
          </p>
          <p className="mt-1 text-xs text-[#718096]">{data.destination}</p>
          <p className="mt-0.5 text-xs text-[#718096]">
            {data.startDate} ~ {data.endDate} · {data.duration} ·{" "}
            {data.maxPeople}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex gap-3 rounded-xl border border-[#E1E8EF] p-4">
          <Image
            src="/images/AirplaneCyan.svg"
            alt="항공권"
            width={20}
            height={20}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs font-bold text-[#439A97]">항공권</p>
            {outboundFlight && (
              <>
                <p className="mt-1 text-sm font-bold text-[#0A1628]">
                  {data.airline} {outboundFlight.flightNumber}
                </p>
                <p className="mt-1 text-xs text-[#718096]">
                  {outboundFlight.departureAirport} →{" "}
                  {outboundFlight.arrivalAirport}
                </p>
                <p className="mt-0.5 text-xs text-[#718096]">
                  {outboundFlight.date} {outboundFlight.departureTime} 출발
                </p>
              </>
            )}
            <p className="mt-2 text-sm font-extrabold text-[#439A97]">
              {data.booking.flightPrice.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-[#E1E8EF] p-4">
          <Image
            src="/images/HotelCyan.svg"
            alt="숙소"
            width={20}
            height={20}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs font-bold text-[#439A97]">숙소</p>
            <p className="mt-1 text-sm font-bold text-[#0A1628]">
              {data.accommodation.name}
            </p>
            <p className="mt-1 text-xs text-[#718096]">
              {data.accommodation.checkIn} ~ {data.accommodation.checkOut}
            </p>
            <p className="mt-0.5 text-xs text-[#718096]">
              {data.accommodation.nights}
            </p>
            <p className="mt-2 text-sm font-extrabold text-[#439A97]">
              {data.booking.stayPrice.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
