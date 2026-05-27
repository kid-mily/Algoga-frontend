"use client";

import FlightCard from "./FlightCard";
import HotelCard from "./HotelCard";

interface PackageCardProps {
  title: string;
  description: string;
  location: string;
  duration: string;
  lecture: string;
  active: boolean;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  flight: {
    airline: string;
    time: string;
    duration: string;
    price: number;
  };

  hotel: {
    hotel: string;
    location: string;
    rating: string;
    stars: number;
    price: number;
  };

  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PackageCard({
  title,
  description,
  location,
  duration,
  lecture,
  active,

  originalPrice,
  discountPercent,
  finalPrice,

  flight,
  hotel,

  onEdit,
  onDelete,
}: PackageCardProps) {

  return (
    <div className="rounded-[20px] border border-[#E4E7EC] bg-white p-5">
      {/* 상단 */}
      <div className="flex items-start justify-between">
        {/* 좌측 */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[24px] font-bold text-[#111827]">
              {title}
            </h2>

            {active && (
              <div className="rounded-full bg-[#ECFDF3] px-3 py-1 text-[13px] font-semibold text-[#16A34A]">
                활성
              </div>
            )}
          </div>

          <p className="mt-2 text-[15px] text-[#667085]">
            {description}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[14px] text-[#98A2B3]">
            <span>{location}</span>
            <span>{duration}</span>
            <span className="font-semibold text-[#439A97]">
              • {lecture}
            </span>
          </div>
        </div>

        {/* 액션 */}
        <div className="flex items-center gap-5">
          {/* 수정 */}
          <button
            onClick={onEdit}
          >
            <img
              src="/images/edit.svg"
              alt="수정"
              className="h-[18px] w-[18px]"
            />
          </button>

          {/* 삭제 */}
          <button
            onClick={onDelete}
          >
            <img
              src="/images/delete.svg"
              alt="삭제"
              className="h-[18px] w-[18px]"
            />
          </button>
        </div>
      </div>

      {/* 카드 */}
      <div className="mt-5 flex gap-4">
        <FlightCard {...flight} />
        <HotelCard {...hotel} />
      </div>

      {/* 하단 */}
      <div className="mt-5 flex items-end justify-between border-t border-[#E4E7EC] pt-5">
        {/* 가격 */}
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold text-[#98A2B3] line-through">
            ₩{originalPrice.toLocaleString()}
          </span>
          <div className="rounded-full bg-[#FEF2F2] px-3 py-1 text-[14px] font-bold text-[#DC2626]">
            {discountPercent}% 할인
          </div>
        </div>

        {/* 최종가 */}
        <div className="text-right">
          <p className="text-[13px] text-[#98A2B3]">
            최종 가격
          </p>
          <p className="mt-1 text-[30px] font-bold text-[#439A97]">
            ₩{finalPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}