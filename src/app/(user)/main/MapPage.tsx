'use client'

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import('@/features/map/components/WorldMap'), {
  ssr: false, 
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-xl">
      지도를 로딩 중입니다...
    </div>
  )
});

export default function MapPage() {
    return (
      <div className="p-10 w-full min-h-screen bg-[#f5f6f8]">
      <div className="max-w-5xl w-full h-[500px] border rounded-xl overflow-hidden shadow-lg bg-white mx-auto">
        {/* <WorldMap /> */}
      </div>
      </div>
    )
}