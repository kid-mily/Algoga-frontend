'use client'

import { useEffect, useState } from 'react';
import BannerItem from './BannerItem';
import { Banner } from './Types';
import { getMainBanners } from '@/features/services/banner.service';


export default function MainBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  // 다음 배너로 이동
  const nextBanner = () => {
    if (current === banners.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  // 이전 배너로 이동
  const prevBanner = () => {
    if (current === 0) {
      setCurrent(banners.length - 1);
    } else {
      setCurrent(current - 1);
    }
  };

  useEffect(() => {
    // API 호출
    const bannersAPI = async () => {
      const data = await getMainBanners();
      // 데이터가 정상적으로 들어왔을 때만 상태 업데이트
      if (data && data.length > 0) {
        setBanners(data);
      }
    };

    bannersAPI();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => {
        if (prev === banners.length - 1) {
          return 0;
        }
        
        return prev + 1;
      });
    }, 3000);
    
    return () => clearInterval(interval);}, [banners]);

  // 데이터 없을 때
  if (banners.length === 0) {
    return (
      <div className="h-[200px] w-full max-w-5xl mx-auto rounded-3xl bg-gray-200 animate-pulse" />
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* 현재 배너 */}
      <BannerItem
      banner={banners[current]}
    />
      
      {/* 이전 버튼 */}
      <button
        onClick={prevBanner}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 text-white text-2xl 
        bg-black/30 hover:bg-black/50 rounded-full flex items-center pl-2 pr-2"
      >
        ←
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={nextBanner}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 text-white text-2xl
        bg-black/30 hover:bg-black/50 rounded-full flex items-center pl-2 pr-2"
      >
        →
      </button>

      {/* 밑 점 */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {banners.map((_, index) => (
          <button
            key={banners[index].bannerId}
            onClick={() => setCurrent(index)}
            className={`
              h-3 w-3 rounded-full transition-colors
              ${current === index ? 'bg-white' : 'bg-white/40'}
            `}
          />
        ))}
      </div>
    </div>
  );
}