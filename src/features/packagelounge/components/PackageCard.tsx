"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import type { PackageApiItem } from "../types";
import { formatPackageSchedule } from "../utils/payment";
import { savePackageSelection } from "../utils/selectionStorage";

interface PackageCardProps {
  item: PackageApiItem;
  courseId: number;
  continentCode: string;
}

export default function PackageCard({
  item,
  courseId,
  continentCode,
}: PackageCardProps) {
  const router = useRouter();
  const flight = item.flightInfo;

  const handleSelect = () => {
    savePackageSelection({
      courseId,
      countryId: item.countryId,
      continentCode,
      packageId: item.packageId,
      accommodationId: item.accommodationId,
      flightInfo: item.flightInfo,
      flightPrice: item.flightPrice,
    });

    router.push("/packagelounge/reservation");
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-[#E4E8EF] bg-white shadow-[0_14px_35px_rgba(26,45,78,0.08)]">
      {item.imageUrl && (
        <div className="relative h-48">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 430px"
            className="object-cover"
          />
        </div>
      )}

      <header className="bg-[#FFF6E3] px-6 py-5">
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#439A97]">
          TRAVEL PACKAGE
        </span>
        <h2 className="mt-4 text-xl font-extrabold text-[#0A1628]">
          {item.name}
        </h2>
        <p className="mt-2 text-xs text-[#6F7F95]">
          {formatPackageSchedule(item)}
        </p>
        {item.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#8796AA]">
            {item.description}
          </p>
        )}
      </header>

      <div className="space-y-4 p-6">
        {flight ? (
          <>
            <InformationRow
              label="항공사"
              value={`${flight.airline} ${flight.flightNumber}`}
            />
            <InformationRow
              label="항공편"
              value={`${flight.departure} → ${flight.arrival}`}
            />
            <InformationRow label="비행시간" value={flight.duration} />
            <InformationRow
              label="항공권 금액"
              value={`${item.flightPrice.toLocaleString()}원`}
            />
          </>
        ) : (
          <div className="rounded-xl bg-[#FFF8E7] p-3 text-xs text-[#98701B]">
            현재 항공편 정보를 불러올 수 없습니다.
          </div>
        )}

        <div className="border-t border-[#EDF0F4] pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] text-[#98A2B3]">패키지 가격</p>
              <strong className="mt-1 block text-2xl text-[#439A97]">
                {item.price.toLocaleString()}원
              </strong>
            </div>
            <button
              type="button"
              onClick={handleSelect}
              className="rounded-xl bg-[#439A97] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#377F7C]"
            >
              패키지 선택
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function InformationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-5 text-sm">
      <span className="shrink-0 text-[#8796AA]">{label}</span>
      <strong className="text-right text-[#182230]">{value}</strong>
    </div>
  );
}
