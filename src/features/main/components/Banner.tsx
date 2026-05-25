'use client'

import { useEffect, useState } from 'react';
import BannerItem from './BannerItem';

interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
}

export default function MainBanner() {
  // 백엔드 데이터 들어올 자리
  const [banners, setBanners] = useState<Banner[]>([]);

  // 현재 배너 index
  const [current, setCurrent] = useState(0);

  // 다음 배너
  const nextBanner = () => {
    if (current === banners.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  // 이전 배너
  const prevBanner = () => {
    if (current === 0) {
      setCurrent(banners.length - 1);
    } else {
      setCurrent(current - 1);
    }
  };

  useEffect(() => {
    // 추후 axios 연결

    // 임시 데이터
    const mockData: Banner[] = [
      {
        id: 1,
        imageUrl: '/images/banner1.png',
        linkUrl: '/event/1',
      },
      {
        id: 2,
        imageUrl: '/images/banner2.png',
        linkUrl: '/event/2',
      },
      {
        id: 3,
        imageUrl: '/images/banner3.png',
        linkUrl: '/event/3',
      },
    ];

    setBanners(mockData);
  }, []);

   // 데이터 없을 때
  if (banners.length === 0) {
    return (
      <div className="h-[320px] rounded-3xl bg-gray-200" />
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* 현재 배너 */}
      <BannerItem banner={banners[current]} />

      {/* top-1/2: 부모 높이의 50% 위치 */}
      {/* -translate-y-1/2: 자기 높이의 절반만큼 위로 다시 올림 */}
      
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
            key={index}
            onClick={() => setCurrent(index)}
            className={`
              h-3 w-3 rounded-full
              ${current === index ? 'bg-white' : 'bg-white/40'}
            `}
          />
        ))}
      </div>

    </div>
  );
}