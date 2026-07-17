"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/features/friends/components/FriendPanel";
import type { PackageApiItem } from "../types";
import PackageLoungeCard from "./PackageLoungeCard";

interface PackageLoungeListClientProps {
  packages: PackageApiItem[];
  // 진단평가에서 넘어온 경우 카드/상세/예약 화면까지 계속 이어줄 값들
  courseId?: string;
  continentCode?: string;
}

type SortType = "recommended" | "priceLow" | "priceHigh" | "departureSoon";

const SORT_OPTIONS: { label: string; value: SortType }[] = [
  { label: "전체", value: "recommended" },
  { label: "금액 낮은 순", value: "priceLow" },
  { label: "금액 높은 순", value: "priceHigh" },
  { label: "출발일 빠른 순", value: "departureSoon" },
];

// 패키지 라운지 목록 화면
export default function PackageLoungeListClient({
  packages,
  courseId,
  continentCode,
}: PackageLoungeListClientProps) {
  const [selectedSort, setSelectedSort] = useState<SortType>("recommended");

  const sortedPackages = useMemo(() => {
    const copiedPackages = [...packages];

    if (selectedSort === "priceLow") {
      return copiedPackages.sort((a, b) => a.totalPrice - b.totalPrice);
    }

    if (selectedSort === "priceHigh") {
      return copiedPackages.sort((a, b) => b.totalPrice - a.totalPrice);
    }

    if (selectedSort === "departureSoon") {
      return copiedPackages.sort(
        (a, b) =>
          new Date(a.checkInDate).getTime() -
          new Date(b.checkInDate).getTime()
      );
    }

    return copiedPackages;
  }, [packages, selectedSort]);

  return (
    <>
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

      {/* 패키지 카드 목록 */}
      {sortedPackages.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#E1E8EF] bg-white py-12 shadow-sm">
          <EmptyState
            title="조회 가능한 패키지가 없습니다."
            description="다른 국가를 선택하거나 잠시 후 다시 시도해 주세요."
          />
        </div>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPackages.map((item) => (
            <PackageLoungeCard
              key={item.packageId}
              item={item}
              courseId={courseId}
              continentCode={continentCode}
            />
          ))}
        </section>
      )}
    </>
  );
}
