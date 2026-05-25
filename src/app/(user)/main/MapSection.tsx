'use client'

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('@/features/map/components/WorldMap'), {
  ssr: false, 
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-xl">
      지도를 로딩 중입니다...
    </div>
  )
});

export default function MapSection() {
  return <WorldMap />;
}