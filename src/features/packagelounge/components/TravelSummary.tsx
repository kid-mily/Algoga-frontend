import Image from "next/image";
import { CourseItem } from "@/features/classroom/components/types";
import { PackageDetailData } from "../packageDetail.types";

interface TravelSummaryProps {
  data: PackageDetailData;
  // 강의는 패키지와 백엔드에서 연결돼 있지 않아 country 기준으로 별도 조회한 값 (없을 수 있음)
  course: CourseItem | null;
}

// 예약 01단계: 여행 일정(패키지 썸네일 + 항공/숙소/강의) 요약 카드
export default function TravelSummary({ data, course }: TravelSummaryProps) {
  const outboundFlight = data.flights[0];

  return (
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.06)] sm:p-6">
      <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
        TRAVEL SUMMARY
      </span>
      <h2 className="mt-1 text-lg font-bold text-[#0A1628]">여행 정보 확인</h2>

      <div className="mt-4">
        {/* 패키지 썸네일 + 기본 일정 */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={data.heroImage}
              alt={data.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#0A1628]">
              {data.title}
            </h3>
            <p className="mt-1 text-xs text-[#718096]">
              {data.startDate} ~ {data.endDate}
            </p>
            <p className="mt-0.5 text-xs text-[#718096]">
              {data.duration} · {data.maxPeople} 기준
            </p>
          </div>
        </div>

        {/* 항공 / 숙소 카드 */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex gap-3 rounded-xl border border-[#E1E8EF] p-4">
            <Image
              src="/images/AirplaneCyan.svg"
              alt="항공"
              width={20}
              height={20}
              className="mt-0.5 shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-[#439A97]">항공</p>
              {outboundFlight && (
                <>
                  <p className="mt-1 text-sm font-bold text-[#0A1628]">
                    {outboundFlight.departureAirport} →{" "}
                    {outboundFlight.arrivalAirport}
                  </p>
                  <p className="mt-1 text-xs text-[#718096]">
                    {data.airline} · 왕복
                  </p>
                  <p className="mt-0.5 text-xs text-[#718096]">
                    {outboundFlight.departureTime} 출발 ·{" "}
                    {outboundFlight.arrivalTime} 도착
                  </p>
                </>
              )}
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
                체크인 {data.accommodation.checkIn}
              </p>
              <p className="mt-0.5 text-xs text-[#718096]">
                체크아웃 {data.accommodation.checkOut}
              </p>
            </div>
          </div>
        </div>

        {/* 선택한 강의 (패키지와 백엔드에서 연결돼 있지 않아 별도 조회, 없으면 표시하지 않음) */}
        {course && (
          <div className="mt-3 flex gap-3 rounded-xl border border-[#E1E8EF] p-4">
            <Image
              src="/images/book.svg"
              alt="강의"
              width={20}
              height={20}
              className="mt-0.5 shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-[#439A97]">선택한 강의</p>
              <p className="mt-1 text-sm font-bold text-[#0A1628]">
                {course.title}
              </p>
              <p className="mt-1 text-xs text-[#718096]">
                {course.levelName} · {course.price.toLocaleString()}원
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
