"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "./Types";

interface BannerSliderProps {
    banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const hasBanners = banners.length > 0;
    const hasMultipleBanners = banners.length > 1;

    // 다음
   const nextBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, [banners.length]);

    // 이전
    const prevBanner = () => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (!hasMultipleBanners) return;

        const interval = window.setInterval(nextBanner, 3000);  // 3초

        return () => window.clearInterval(interval);
    }, [hasMultipleBanners, nextBanner]);

    if (!hasBanners) {
        return (
        <div
            className="h-[200px] w-full rounded-3xl bg-gray-200 animate-pulse"
        />
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <article
            className="relative w-full overflow-hidden rounded-3xl"
        >
        <Link href={currentBanner.linkUrl || "/"} className="block">
            <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.text || "메인 배너"}
            width={896}
            height={200}
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="h-[200px] w-full object-cover"
            />
        </Link>

        {hasMultipleBanners && (
            <>
            <button
                type="button"
                onClick={prevBanner}
                aria-label="이전 배너 보기"
                className="absolute left-5 top-1/2 z-30 flex -translate-y-1/2 items-center rounded-full bg-black/30 px-2 text-2xl text-white hover:bg-black/50"
            >
                {"<"}
            </button>

            <button
                type="button"
                onClick={nextBanner}
                aria-label="다음 배너 보기"
                className="absolute right-5 top-1/2 z-30 flex -translate-y-1/2 items-center rounded-full bg-black/30 px-2 text-2xl text-white hover:bg-black/50"
            >
                {">"}
            </button>

            <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3">
                {banners.map((banner, index) => (
                <button
                    key={banner.bannerId}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`${index + 1}번째 배너 보기`}
                    aria-current={currentIndex === index}
                    className={`h-3 w-3 rounded-full transition-colors ${
                    currentIndex === index ? "bg-white" : "bg-white/40"
                    }`}
                />
                ))}
            </div>
            </>
        )}
        </article>
    );
}