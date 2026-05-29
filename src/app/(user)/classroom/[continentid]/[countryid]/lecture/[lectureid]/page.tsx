import LectureSideBar from "@/features/classroom/LectureSideBar";

// 강의 상세 페이지
export default function LectureDetaile() {
    
    return (
    <div className="w-full min-h-screen bg-[#f5f6f8] grid grid-cols-[320px_1fr]">
        {/* 사이드바 */}
        <LectureSideBar />
        
        {/* 영상 */}
        <div className="p-8"> 
            {/* 강의 상세 설명 */}
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-black mt-2 text-[#0A1628]]">
                        01장. 미국 동부 여행 개요 및 일정 짜기 상세 소개
                    </h2>
                    <p className="text-xs text-gray-400 mt-2">
                        업로드 날짜: 2026년 5월
                    </p>
                </div>
                <hr className="border-gray-100 mt-5 mb-5"/>
                {/* 설명 */}
                <div className="text-sm text-[#0A1628] leading-relaxed">
                    <p className="font-bold text-[#0A1628]">
                        챕터 정보 나와야 함
                    </p>
                    <p className="text-[#8A9BB0]">
                        강의에 대한 설명 나와야 함
                    </p>
                </div>
            </div>
        </div>
    </div>
    );
}