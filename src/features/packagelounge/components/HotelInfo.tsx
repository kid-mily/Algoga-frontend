import Image from "next/image";
import PackageInfoCard from "./PackageInfoCard";
import type { PackageAccommodation } from "../packageDetail.types";

interface HotelInfoProps {
  accommodation: PackageAccommodation;
}

// 숙소 정보 탭: 숙소 이미지 + 상세 정보
export default function HotelInfo({ accommodation }: HotelInfoProps) {
  return (
    <div>
      <div className="relative h-48 overflow-hidden rounded-xl">
        <Image
          src={accommodation.image}
          alt={accommodation.name}
          fill
          sizes="(max-width: 640px) 100vw, 720px"
          className="object-cover"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <PackageInfoCard label="체크인" value={accommodation.checkIn} />
        <PackageInfoCard label="숙박 기간" value={accommodation.nights} />
        <PackageInfoCard label="체크아웃" value={accommodation.checkOut} />
      </div>

      <div className="mt-5 rounded-xl border border-[#E1E8EF] bg-white p-5">
        <h3 className="text-base font-extrabold text-[#0A1628]">
          {accommodation.name}
        </h3>
        <p className="mt-1 text-xs text-[#718096]">
          {accommodation.address}
        </p>
        <p className="mt-3 text-sm leading-6 text-[#718096]">
          {accommodation.description}
        </p>
      </div>

      
    </div>
  );
}
