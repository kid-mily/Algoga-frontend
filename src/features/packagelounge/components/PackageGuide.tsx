import PackageInfoCard from "./PackageInfoCard";
import type { PackageDetailData } from "../packageDetail.types";

interface PackageGuideProps {
  data: PackageDetailData;
}

// 패키지 안내 탭: 기본 정보 카드 + 항공권(왕복)/숙소 요약을 위아래로 배치
export default function PackageGuide({ data }: PackageGuideProps) {
  return (
    <div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <PackageInfoCard label="여행지" value={data.destination} />
          <PackageInfoCard label="여행 기간" value={data.duration} />
          <PackageInfoCard label="최대 인원" value={data.maxPeople} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PackageInfoCard label="출발일" value={data.startDate} />
          <PackageInfoCard label="귀국일" value={data.endDate} />
        </div>
      </div>

      {data.description && (
        <div className="mt-6 rounded-xl border border-[#E1E8EF] bg-white p-5">
          <p className="text-xs font-bold text-[#439A97]">패키지 설명</p>
          <p className="mt-2 text-sm leading-6 text-[#718096]">
            {data.description}
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-[#E1E8EF] bg-white p-5">
          <p className="text-xs font-bold text-[#439A97]">항공권 (왕복)</p>
          {data.flights.length > 0 ? (
            <>
              <p className="mt-1 text-sm font-bold text-[#0A1628]">
                {data.airline}
              </p>
              <div className="mt-3 space-y-3">
                {data.flights.map((flight) => (
                  <div key={flight.direction} className="text-xs text-[#0A1628]">
                    <span className="rounded-full bg-[#EEF8F7] px-2 py-0.5 text-[11px] font-bold text-[#357F7C]">
                      {flight.direction}
                    </span>
                    <p className="mt-1.5">
                      {flight.departureAirport} → {flight.arrivalAirport}
                    </p>
                    <p className="mt-0.5 text-[#718096]">
                      {flight.date} {flight.departureTime} ~ {flight.arrivalTime} ·{" "}
                      {flight.duration}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-3 text-xs text-[#98701B]">
              항공권 정보를 불러오지 못했습니다.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[#E1E8EF] bg-white p-5">
          <p className="text-xs font-bold text-[#439A97]">숙소</p>
          <p className="mt-1 text-sm font-bold text-[#0A1628]">
            {data.accommodation.name}
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            {data.accommodation.address}
          </p>
          <p className="mt-3 text-xs text-[#0A1628]">
            체크인 {data.accommodation.checkIn}
          </p>
          <p className="mt-0.5 text-xs text-[#0A1628]">
            체크아웃 {data.accommodation.checkOut} · {data.accommodation.nights}
          </p>
        </div>
      </div>
    </div>
  );
}
