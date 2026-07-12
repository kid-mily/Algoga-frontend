"use client";

import { useState } from "react";
import PackageGuide from "./PackageGuide";
import FlightInfo from "./FlightInfo";
import HotelInfo from "./HotelInfo";
import ReservationGuide from "./ReservationGuide";
import type { PackageDetailData } from "../packageDetail.types";

interface PackageDetailTabsProps {
  data: PackageDetailData;
}

const TABS = ["패키지 안내", "항공권 정보", "숙소 정보", "예약 안내"] as const;
type TabLabel = (typeof TABS)[number];

// 패키지 상세 탭 메뉴 + 선택된 탭의 내용을 보여주는 컴포넌트
export default function PackageDetailTabs({ data }: PackageDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabLabel>(TABS[0]);

  return (
    <div className="mt-6">
      <nav className="flex gap-1 border-b border-[#E1E8EF]">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? "border-[#439A97] text-[#439A97]"
                  : "border-transparent text-[#0A1628]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        {activeTab === "패키지 안내" && <PackageGuide data={data} />}
        {activeTab === "항공권 정보" && (
          <FlightInfo flights={data.flights} airline={data.airline} />
        )}
        {activeTab === "숙소 정보" && (
          <HotelInfo accommodation={data.accommodation} />
        )}
        {activeTab === "예약 안내" && (
          <ReservationGuide notices={data.notices} />
        )}
      </div>
    </div>
  );
}
