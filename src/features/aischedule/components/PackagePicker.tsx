"use client";

import { useEffect, useState } from "react";
import { getSelectablePackages } from "@/features/services/itinerary.service";
import type { SelectablePackageResponse } from "../types";

interface PackagePickerProps {
  selectedPackageId: number | null;
  onSelect: (packageId: number) => void;
}

// tripType=PACKAGE 선택지: 아직 구매하지 않은 상품도 포함한 전체 패키지 카탈로그
export default function PackagePicker({
  selectedPackageId,
  onSelect,
}: PackagePickerProps) {
  const [packages, setPackages] = useState<SelectablePackageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await getSelectablePackages();
        if (active) setPackages(result);
      } catch (error) {
        if (!active) return;
        console.error("[aischedule] 패키지 목록 조회 실패:", error);
        setErrorMessage("패키지 목록을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <p className="rounded-2xl border border-[#E1E8EF] bg-white px-4 py-6 text-center text-sm text-[#8A9BB0]">
        패키지 목록을 불러오는 중입니다...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="rounded-2xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B54747]">
        {errorMessage}
      </p>
    );
  }

  if (packages.length === 0) {
    return (
      <p className="rounded-2xl border border-[#E1E8EF] bg-white px-4 py-6 text-center text-sm text-[#8A9BB0]">
        조회 가능한 패키지가 없습니다.
      </p>
    );
  }

  return (
    <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
      {packages.map((packageItem) => {
        const selected = packageItem.packageId === selectedPackageId;

        return (
          <li key={packageItem.packageId}>
            <button
              type="button"
              onClick={() => onSelect(packageItem.packageId)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                selected
                  ? "border-[#439A97] bg-[#EEF8F7]"
                  : "border-[#E1E8EF] bg-white hover:border-[#B7DAD7]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#0A1628]">
                  {packageItem.name}
                </p>
                <p className="text-sm font-extrabold text-[#439A97]">
                  {packageItem.price.toLocaleString()}원
                </p>
              </div>
              <p className="mt-0.5 text-xs text-[#718096]">
                {packageItem.destination}
              </p>
              <p className="mt-1 text-xs text-[#8A9BB0]">
                {packageItem.startDate} ~ {packageItem.endDate} ·{" "}
                {packageItem.nights}박
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
