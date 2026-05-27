"use client";

interface HotelCardProps {
  hotel: string;
  location: string;
  rating: string;
  stars: number;
  price: number;
}

export default function HotelCard({
  hotel,
  location,
  rating,
  stars,
  price,
}: HotelCardProps) {

  return (
    <div className="flex flex-1 flex-col rounded-[16px] bg-[#FFF8F0] p-4">
      {/* 상단 */}
      <div className="flex items-center gap-2">

        <img
          src="/images/hotel.svg"
          alt="숙소"
          className="h-[15px] w-[15px]"
        />

        <span className="text-[14px] font-semibold text-[#E57A36]">
          숙소
        </span>
      </div>

      {/* 호텔 */}
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-[#111827]">
            {hotel}
          </h3>

          <p className="mt-1 text-[14px] text-[#667085]">
            {location}
          </p>
        </div>

        {/* 별점 */}
        <div className="flex">

          {Array.from({
            length: stars,
          }).map((_, index) => (

            <img
              key={index}
              src="/images/star.svg"
              alt="별점"
              className="h-[13px] w-[13px]"
            />
          ))}
        </div>
      </div>

      {/* 평점 */}
      <p className="mt-2 text-[13px] text-[#98A2B3]">
        {rating}
      </p>
      {/* 가격 */}
      <div className="mt-auto pt-5 text-right text-[17px] font-bold text-[#E57A36]">
        ₩{price.toLocaleString()}/박
      </div>
    </div>
  );
}