"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("@/features/map/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-400">
      지도를 로딩 중입니다...
    </div>
  ),
});

export default function MapPage() {
  return (
    <main className="h-[calc(100dvh-64px)] w-full overflow-hidden bg-[#f5f6f8]">
      <WorldMap />
    </main>
  );
}