import Image from "next/image";
import type { FlightSegment } from "../packageDetail.types";

interface FlightInfoProps {
  flights: FlightSegment[];
  airline: string;
}

// 항공권 정보 탭: 가는 편 / 오는 편 카드
export default function FlightInfo({ flights, airline }: FlightInfoProps) {
  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <div
          key={flight.direction}
          className="rounded-xl border border-[#E1E8EF] bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#439A97] px-3 py-1 text-xs font-bold text-white">
              {flight.direction}
            </span>
            <span className="text-xs text-[#718096]">{flight.date}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-[#0A1628]">
                {flight.departureTime}
              </p>
              <p className="mt-1 text-xs text-[#718096]">
                {flight.departureAirport}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center px-2">
              <span className="text-[11px] text-[#718096]">
                {flight.duration}
              </span>
              <div className="relative my-1 flex h-px w-full items-center bg-[#E1E8EF]">
                <Image
                  src="/images/AirplaneCyan.svg"
                  alt="비행기"
                  width={16}
                  height={16}
                  className="absolute left-1/2 -translate-x-1/2 bg-white px-1"
                />
              </div>
              {flight.isDirect && (
                <span className="text-[11px] font-bold text-[#439A97]">
                  직항
                </span>
              )}
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-[#0A1628]">
                {flight.arrivalTime}
              </p>
              <p className="mt-1 text-xs text-[#718096]">
                {flight.arrivalAirport}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#718096]">
            {airline} · 왕복
          </p>
        </div>
      ))}
    </div>
  );
}
