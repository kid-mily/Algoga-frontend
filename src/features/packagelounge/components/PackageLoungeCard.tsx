import Image from "next/image";
import Link from "next/link";
import type { PackageApiItem } from "../types";
import { buildQueryString } from "../utils/query";

interface PackageLoungeCardProps {
  item: PackageApiItem;
  courseId?: string;
  continentCode?: string;
}

// 패키지 라운지 목록에서 패키지 1개를 보여주는 카드 컴포넌트
export default function PackageLoungeCard({
  item,
  courseId,
  continentCode,
}: PackageLoungeCardProps) {
  const duration = `${item.nights}박 ${item.nights + 1}일`;
  const detailHref = `/packagelounge/${item.packageId}${buildQueryString({ courseId, continentCode })}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:border-[#B7DAD7] hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]">
      {/* 패키지 대표 이미지 영역 */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-[#F3F8FC]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover"
        />
      </div>

      {/* 패키지 정보 영역 */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-extrabold text-[#0A1628]">
            {item.name}
          </h3>
          <p className="mt-1 text-xs text-[#8A9BB0]">
            {duration} · {item.checkInDate} ~ {item.checkOutDate}
          </p>
        </div>

        {/* 항공권 | 숙소 요약 정보 */}
        <p className="text-sm font-medium text-[#718096]">
          {item.flightInfo?.airline ?? "항공권 정보 없음"} · {item.accommodationName}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-dashed border-[#D6E0E8] pt-4">
          <div>
            <p className="text-[11px] text-[#A0AEC0]">1인 기준</p>
            <strong className="mt-1 block text-xl font-extrabold text-[#439A97]">
              {item.totalPrice.toLocaleString()}원
            </strong>
          </div>

          <Link
            href={detailHref}
            className="rounded-xl bg-[#439A97] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#357F7C]"
          >
            자세히 보기
          </Link>
        </div>
      </div>
    </article>
  );
}
