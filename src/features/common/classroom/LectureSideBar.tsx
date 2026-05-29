'use client';

import { useParams } from "next/navigation";
import SubHeader from "../contentmanage/SubHeader";
import { useState } from "react";

// 챕터 더미 데이터
const CHAPTERS = [
    { id: 1, chapter: '01장', title: '미국 동부 여행 개요 및 일정 짜기', duration: '15:20' },
    { id: 2, chapter: '02장', title: '뉴욕 패스 종류 및 완벽 비교', duration: '22:45' },
    { id: 3, chapter: '03장', title: '맨해튼 필수 명소 가이드', duration: '18:10' },
    { id: 4, chapter: '04장', title: '지하철 및 메트로카드 이용 꿀팁', duration: '12:35' },
    { id: 5, chapter: '05장', title: '미국 입국 심사 및 ESTA 비자 준비', duration: '20:15' },
];

export default function LectureSideBar() {
    // 현재 유저가 클릭해서 시청 중인 챕터의 ID 상태
    const [activeChapterId, setActiveChapterId] = useState(1);

    const { continentid, countryid } = useParams();
        
    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col justify-between z-10 min-h-screen">        
        
            {/* 상단 타이틀 및 진도율 영역 */}
            <div className="bg-[#EEF5FF] p-5">          
                <div>
                    {/* 상단 타이틀 */}
                    <SubHeader
                        backHref={`/classroom/${continentid}/${countryid}/lecture`}
                        backText="돌아가기"
                        title="강의 제목 들어와야함"
                        description="강의 세부 설명"
                    />
                    <p className="text-sm text-gray-400 mt-1 font-medium mb-5">
                        ⏱️ 3.5시간 · 📂 12개 강의 · ⭐ 4.8
                    </p>
                </div>

                {/* 진도율 */}
                <div className="mt-1">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500 mb-1">전체 진도율</span>
                        <span className="text-[#439A97]">100%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                        className="h-full bg-[#439A97] rounded-full" 
                        style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </div>
                
            {/* 3. 챕터 리스트 스크롤 영역 */}
            <div className="flex-1 p-5 pt-3">
                <p className="text-xs font-bold text-gray-400 mb-3 pl-1">강의 목차</p>
                
                {CHAPTERS.map((ch) => {
                    const isActive = ch.id === activeChapterId;
                    
                    return (
                        <button
                            key={ch.id}
                            onClick={() => setActiveChapterId(ch.id)}
                            className={`w-full text-left p-3 rounded-xl cursor-pointer flex flex-col gap-1 text-xs mb-3  
                                ${isActive 
                                ? 'bg-[#EBF5F5] text-[#439A97] border border-cyan-800' 
                                : 'bg-white text-[#4A5568] hover:bg-gray-50'
                                }`}
                            >
                            {/* 장 번호 표기 */}
                            <span className={`font-bold text-xs 
                                ${isActive ? 'text-[#439A97]' : 'text-gray-400'}`}
                            >
                                {ch.chapter}
                            </span>
                            
                            {/* 강의 제목과 재생 시간 레이아웃 */}
                            <div className="flex justify-between items-start gap-2">
                                <span className={`font-semibold leading-relaxed flex-1
                                ${isActive ? 'text-[#357A78]' : 'text-gray-700'}`}
                                >
                                {ch.title}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium pt-1s">
                                {ch.duration}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
                
            {/* 퀴즈 버튼 */}
            <div className="p-5 pt-4 border-t border-gray-100">
                <button
                className="w-full h-12 rounded-xl bg-[#439A97] text-white text-sm font-bold hover:bg-[#357A78] cursor-pointer flex items-center justify-center gap-2"
                >
                📝 퀴즈 풀기
                </button>
            </div>
        </div>
    );
}