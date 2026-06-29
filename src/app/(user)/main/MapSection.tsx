"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { preloadWorldGeoJson } from "@/features/map/hooks/useWorldGeoJson";

const loadWorldMap = () => import("@/features/map/components/WorldMap");

const WorldMap = dynamic(loadWorldMap, {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#EDF6FA] text-sm font-medium text-[#7C8A9A]">
      지도를 불러오는 중입니다...
    </div>
  ),
});

export default function MapSection() {
  useEffect(() => {
    void loadWorldMap();
    void preloadWorldGeoJson();
  }, []);

  return (
    <section
      className="h-full w-full overflow-hidden"
      aria-label="세계 지도"
    >
      <WorldMap />
    </section>
  );
}