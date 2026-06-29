// 배너 넘기는 슬라이더

"use client";

import { useCallback, useEffect, useState } from "react";
import BannerSlide from "./BannerSlide";
import { Banner } from "../types";

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

        const intervalId = window.setInterval(nextBanner, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [hasMultipleBanners, nextBanner]);

    if (!hasBanners) {
        return (
            <div className="flex h-[130px] w-full items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-400">
            배너를 불러오지 못했습니다.
            </div>
        );
    }
    return (
        <article
            className="relative w-full overflow-hidden rounded-2xl bg-white"
            aria-label="메인 배너"
        >
            <div className="relative h-[130px] w-full">
                {banners.map((banner, index) => (
                    <BannerSlide
                        key={banner.bannerId}
                        banner={banner}
                        isActive={index === currentIndex}
                        isPriority={index === 0}
                    />
                ))}
            </div>

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
                                onClick={() => setCurrentIndex(index)}
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