"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("@/features/map/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-gray-100 text-sm font-medium text-gray-400">
      지도를 로딩 중입니다...
    </div>
  ),
});

export default function MapSection() {
  return <WorldMap />;
}