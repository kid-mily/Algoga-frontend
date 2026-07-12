"use client";

import { useMemo, useState } from "react";
import PackageLoungeCard, { PackageLoungeItem } from "@/features/packagelounge/components/PackageLoungeCard";

// 디자인 확인용 더미 패키지 목록
const DUMMY_PACKAGES: PackageLoungeItem[] = [
  {
    id: 1,
    region: "도쿄",
    title: "도쿄 프리미엄 패키지", 
    duration: "4박 5일",
    dateRange: "2024.06.15 - 2024.06.19",
    transportAndStay: "대한항공 | 신주쿠 프린스 호텔",
    pricePerPerson: 770000,
    imageSrc: "/images/thumb.png",
  },
  {
    id: 2,
    region: "오사카",
    title: "오사카 맛집 탐방 패키지",
    duration: "3박 4일",
    dateRange: "2024.06.20 - 2024.06.23",
    transportAndStay: "아시아나항공 | 도톤보리 엑셀 호텔",
    pricePerPerson: 700000,
    imageSrc: "/images/thumb.png",
  },
  {
    id: 3,
    region: "파리",
    title: "파리 럭셔리 패키지",
    duration: "5박 7일",
    dateRange: "2024.07.10 - 2024.07.16",
    transportAndStay: "에어프랑스 | 르 마레 부티크 호텔",
    pricePerPerson: 1600000,
    imageSrc: "/images/thumb.png",
  },
  {
    id: 4,
    region: "방콕",
    title: "방콕 리조트 패키지",
    duration: "4박 5일",
    dateRange: "2024.07.01 - 2024.07.05",
    transportAndStay: " 타이항공 | 방콕 리버사이드 리조트",
    pricePerPerson: 1000000,
    imageSrc: "/images/thumb.png",
  },
];

type SortType = "recommended" | "priceLow" | "priceHigh" | "departureSoon";

const SORT_OPTIONS: { label: string; value: SortType }[] = [
  { label: "전체", value: "recommended" },
  { label: "금액 낮은 순", value: "priceLow" },
  { label: "금액 높은 순", value: "priceHigh" },
  { label: "출발일 빠른 순", value: "departureSoon" },
];

function getDepartureTime(dateRange: string) {
  const departureDate = dateRange.split(" - ")[0];

  return new Date(departureDate.replaceAll(".", "-")).getTime();
}

export default function PackageLoungePage() {
  const [selectedSort, setSelectedSort] = useState<SortType>("recommended");

  const sortedPackages = useMemo(() => {
    const copiedPackages = [...DUMMY_PACKAGES];

    if (selectedSort === "priceLow") {
      return copiedPackages.sort(
        (a, b) => a.pricePerPerson - b.pricePerPerson,
      );
    }

    if (selectedSort === "priceHigh") {
      return copiedPackages.sort(
        (a, b) => b.pricePerPerson - a.pricePerPerson,
      );
    }

    if (selectedSort === "departureSoon") {
      return copiedPackages.sort(
        (a, b) => getDepartureTime(a.dateRange) - getDepartureTime(b.dateRange),
      );
    }

    return copiedPackages;
  }, [selectedSort]);

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* 페이지 상단 타이틀 영역 */}
        <section className="px-6 py-8">
          <span className="text-xs font-bold tracking-[0.16em] text-[#439A97]">
            PACKAGE LOUNGE
          </span>

          <h1 className="mt-2 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
            패키지 라운지
          </h1>

          <p className="mt-2 text-sm text-[#8A9BB0]">
            항공권과 숙소가 하나로 묶인 여행 패키지를 탐색하세요
          </p>

          {/* 정렬 필터 영역 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {SORT_OPTIONS.map((option) => {
              const isActive = option.value === selectedSort;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedSort(option.value)}
                  className={`h-9 rounded-lg border px-4 text-sm font-bold transition ${
                    isActive
                      ? "border-[#439A97] bg-[#439A97] text-white"
                      : "border-[#E1E8EF] bg-white text-[#718096] hover:border-[#439A97]/60 hover:text-[#439A97]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 패키지 카드 목록 */}
        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPackages.map((item) => (
            <PackageLoungeCard key={item.id} item={item} />
          ))}
        </section>
      </div>
    </main>
  );
}
