'use client';

import { useParams } from "next/navigation";
import SubHeader from "../../contentmanage/common/SubHeader";
import { ChapterItem, VideoItem } from "./types";

interface LectureSideBarProps {
    chapters: ChapterItem[];
    currentVideoId?: number;
    onVideoSelect: (video: VideoItem) => void;
    courseTitle?: string;
    courseDescription?: string;
}

export default function LectureSideBar({
    chapters,
    currentVideoId,
    onVideoSelect,
    courseTitle = "강의실",
    courseDescription = "여행 전 필요한 지식을 수강하세요"
}: LectureSideBarProps) {
    const { continentCode, countryid } = useParams();

    //  백엔드가 준 챕터별 progressRate 목록으로 전체 평균 진도율 계산
    const totalChapters = chapters.length;
    const averageProgress = totalChapters > 0
        ? Math.round(chapters.reduce((acc, ch) => acc + (ch.progressRate || 0), 0) / totalChapters)
        : 0;

    // 총 강의 수 계산
    const totalVideosCount = chapters.reduce((acc, ch) => acc + (ch.videos?.length || 0), 0);

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col justify-between z-10 min-h-screen">         
            
            {/* 상단 타이틀 및 진도율 영역 */}
            <div className="bg-[#EEF5FF] p-5">          
                <div>
                    {/* 상단 타이틀 */}
                    <SubHeader
                        backHref={`/classroom/${continentCode}/${countryid}/lecture`}
                        backText="돌아가기"
                        title={courseTitle}
                        description={courseDescription}
                    />
                    <p className="text-sm text-gray-400 mt-1 font-medium mb-5">
                        📂 {totalVideosCount}개 강의 · ⭐ 실시간 수강 중
                    </p>
                </div>

                {/* 진도율 게이지 */}
                <div className="mt-1">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500 mb-1">전체 진도율</span>
                        <span className="text-[#439A97]">{averageProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#439A97] rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${averageProgress}%` }}
                        />
                    </div>
                </div>
            </div>
                
            {/* 챕터 리스트 */}
            <div className="flex-1 p-5 pt-3 overflow-y-auto max-h-[calc(100vh-280px)]">
                <p className="text-xs font-bold text-gray-400 mb-3 pl-1">강의 목차</p>
                
                {chapters.map((ch, chIdx) => {
                    // 챕터 내부의 비디오 목록을 순회하여 출력
                    return (ch.videos || []).map((video) => {
                        const isActive = video.videoId === currentVideoId;
                        
                        return (
                            <button
                                key={video.videoId}
                                onClick={() => onVideoSelect(video)}
                                className={`w-full text-left p-3 rounded-xl cursor-pointer flex flex-col gap-1 text-xs mb-3 transition-colors  
                                    ${isActive 
                                    ? 'bg-[#EBF5F5] text-[#439A97] border border-cyan-800' 
                                    : 'bg-white text-[#4A5568] hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                {/* 장 번호 표기  */}
                                <div className="flex justify-between items-center w-full">
                                    <span className={`font-bold text-xs ${isActive ? 'text-[#439A97]' : 'text-gray-400'}`}>
                                        {ch.chapterNumber || `${String(chIdx + 1).padStart(2, '0')}장`}
                                    </span>
                                    {/* 챕터별 진도 현황 표기 */}
                                    {ch.completed && (
                                        <span className="text-[10px] bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded font-bold">✓ 완료</span>
                                    )}
                                </div>
                                
                                {/* 강의 제목과 재생 시간 */}
                                <div className="flex justify-between items-start gap-2 w-full mt-0.5">
                                    <span className={`font-semibold leading-relaxed flex-1 text-left
                                        ${isActive ? 'text-[#357A78]' : 'text-gray-700'}`}
                                    >
                                        {video.title}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium pt-0.5 whitespace-nowrap">
                                        {video.duration || "재생 불가능"}
                                    </span>
                                </div>
                            </button>
                        );
                    });
                })}
            </div>
                
            {/* 퀴즈 버튼 */}
            <div className="p-5 pt-4 border-t border-gray-100 bg-white">
                <button
                    className="w-full h-12 rounded-xl bg-[#439A97] text-white text-sm font-bold hover:bg-[#357A78] cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                    📝 퀴즈 풀기
                </button>
            </div>
        </div>
    );
}