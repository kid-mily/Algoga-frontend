"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("@/features/map/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-400">
      지도를 로딩 중입니다...
    </div>
  ),
});

export default function MapSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        window.requestAnimationFrame(() => {
          setShouldRenderMap(true);
        });

        observer.disconnect();
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-full w-full overflow-hidden"
      aria-label="세계 지도"
    >
      {shouldRenderMap ? (
        <WorldMap />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#EDF6FA] text-sm font-medium text-[#7C8A9A]">
          지도를 준비 중입니다...
        </div>
      )}
    </section>
  );
}
