"use client";

interface FlightCardProps {
  airline: string;

  time: string;

  duration: string;

  price: number;
}

export default function FlightCard({
  airline,
  time,
  duration,
  price,
}: FlightCardProps) {

  return (
    <div className="flex flex-1 flex-col rounded-[16px] bg-[#F0FDF9] p-4">

      {/* 상단 */}
      <div className="flex items-center gap-2">
        <img
          src="/images/flight.svg"
          alt="항공권"
          className="h-[15px] w-[15px]"
        />
        <span className="text-[14px] font-semibold text-[#439A97]">
          항공권
        </span>
      </div>
      {/* 항공사 */}
      <div className="mt-3">
        <h3 className="text-[17px] font-bold text-[#111827]">
          {airline}
        </h3>
      </div>

      {/* 시간 */}
      <p className="mt-2 text-[15px] font-semibold text-[#667085]">
        {time}
      </p>
      {/* 비행시간 */}
      <p className="mt-1 text-[13px] text-[#98A2B3]">
        {duration}
      </p>
      {/* 가격 */}
      <div className="mt-auto pt-5 text-right text-[17px] font-bold text-[#439A97]">
        ₩{price.toLocaleString()}
      </div>
    </div>
  );
}