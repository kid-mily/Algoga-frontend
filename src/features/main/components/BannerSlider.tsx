"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Banner } from "./Types";

interface BannerSliderProps {
    banners: Banner[];
}

export default function BannerSlider({
    banners,
}: BannerSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const hasBanners = banners.length > 0;
    const hasMultipleBanners = banners.length > 1;

    const nextBanner = useCallback(() => {
        setCurrentIndex((previous) =>
        previous === banners.length - 1
            ? 0
            : previous + 1
        );
    }, [banners.length]);

    const prevBanner = () => {
        setCurrentIndex((previous) =>
        previous === 0
            ? banners.length - 1
            : previous - 1
        );
    };

    useEffect(() => {
        if (!hasMultipleBanners) return;

        const intervalId = window.setInterval( nextBanner, 5000 );

        return () => {
        window.clearInterval(intervalId);
        };
    }, [hasMultipleBanners, nextBanner]);

    if (!hasBanners) {
        return (
        <div className="h-[200px] w-full animate-pulse rounded-3xl bg-gray-200" />
        );
    }

    const currentBanner = banners[currentIndex];
    const bannerText =
        currentBanner.text || "메인 배너";

    return (
        <article
        className="relative w-full overflow-hidden rounded-2xl bg-white"
        aria-label="메인 배너"
        >
        <Link
            href={currentBanner.linkUrl || "/"}
            className="block"
        >
            {currentBanner.fileType === "VIDEO" ? (
            <video
                src={currentBanner.imageUrl}
                className="h-[130px] w-full object-cover"
                muted
                autoPlay
                loop
                playsInline
                aria-label={bannerText}
            />
            ) : (
            <img
                src={currentBanner.imageUrl}
                alt={bannerText}
                className="h-[130px] w-full object-cover"
            />
            )}
        </Link>

        {hasMultipleBanners && (
            <>
            <button
                type="button"
                onClick={prevBanner}
                aria-label="이전 배너 보기"
                className="absolute left-4 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xl text-white hover:bg-black/50"
            >
                &lt;
            </button>

            <button
                type="button"
                onClick={nextBanner}
                aria-label="다음 배너 보기"
                className="absolute right-4 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xl text-white hover:bg-black/50"
            >
                &gt;
            </button>

            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
                {banners.map((banner, index) => (
                <button
                    key={banner.bannerId}
                    type="button"
                    onClick={() =>
                    setCurrentIndex(index)
                    }
                    aria-label={`${index + 1}번째 배너 보기`}
                    aria-current={
                    currentIndex === index
                        ? "true"
                        : undefined
                    }
                    className={`h-2.5 rounded-full transition-all ${
                    currentIndex === index
                        ? "w-6 bg-white"
                        : "w-2.5 bg-white/50"
                    }`}
                />
                ))}
            </div>
            </>
        )}
        </article>
    );
}