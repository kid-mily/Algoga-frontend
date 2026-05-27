'use client'

import { lectures } from "@/features/contentmanage/MockData";
import { useParams, useRouter } from "next/navigation";

// 추천 강의 Mock 데이터
const RECOMMENDED_COURSES = [
  { id: 1, tag: '중급', title: '일본 소도시 감성 이해하기', duration: '61분', level: '중급', rating: 5.0, price: '75,200원', bgImage: '/images/course1.jpg' },
  { id: 2, tag: '중급', title: '아시아 로컬 파이터 이야기', duration: '57분', level: '중급', rating: 5.0, price: '65,200원', bgImage: '/images/course2.jpg' },
  { id: 3, tag: '중급', title: '일본 맛집 투어 가이드', duration: '45분', level: '중급', rating: 4.7, price: '55,200원', bgImage: '' }, // 이미지 없는 케이스 대비
  { id: 4, tag: '중급', title: '도심 애니메이션 스튜디오 탐방', duration: '71분', level: '중급', rating: 4.9, price: '85,200원', bgImage: '/images/course1.jpg' },
  { id: 5, tag: '중급', title: '전통 다도 체험 워크숍', duration: '51분', level: '중급', rating: 5.0, price: '72,200원', bgImage: '/images/course2.jpg' },
  { id: 6, tag: '초급', title: '세계 맛집 탐방 및 시식', duration: '40분', level: '초급', rating: 4.6, price: '50,200원', bgImage: '' },
  { id: 7, tag: '중급', title: '교토 전통 가옥 체험', duration: '65분', level: '중급', rating: 4.7, price: '74,200원', bgImage: '/images/course1.jpg' },
  { id: 8, tag: '중급', title: '남바 야시장 클래스', duration: '48분', level: '중급', rating: 5.0, price: '73,200원', bgImage: '/images/course2.jpg' },
  { id: 9, tag: '고급', title: '일본 정원 디자인의 기술', duration: '80분', level: '고급', rating: 4.8, price: '95,200원', bgImage: '' },
];

export default function EvaluationResult() {
    const router = useRouter();
    const { continentid, countryid, lectureid } = useParams();


    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] py-8 px-4">
            <div className="max-w-4xl mx-auto py-8">
                {/* 진단 평가 완료 */}
                <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-2xl">🏅</div>
                    <h1 className="text-3xl font-bold text-[#0A1628] mt-3">진단 평가 완료!</h1>
                    <p className="text-[#8A9BB0] text-sm mt-2">나에게 맞는 강의를 추천해 드릴게요</p>
                    <div className="inline-block bg-[#FFF3E0] text-[#FF9800] px-6 py-3 rounded-xl font-bold text-sm mt-2">수준 : 중급</div>
                </div>

                    {/* 유저 성향 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4 mt-5">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🧭</div>
                        <div>
                            <h2 className="font-bold text-[#0A1628]">경험 있는 여행자</h2>
                            <p className="text-gray-400 text-xs mt-1">기존에 한두 번 다녀오신 분들이 듣기 좋은 레벨을 추천해요.</p>
                        </div>
                    </div>
                    
                    {/* 추천 강의 */}
                    <h3 className="text-2xl font-bold text-[#0A1628] flex items-center mt-10 mb-5 ml-3">추천 강의</h3>
                    <div className="grid grid-cols-4 gap-6">
                        {RECOMMENDED_COURSES.map((course) => (
                        <div key={course.id} className="bg-white rounded-2xl shadow-sm flex flex-col border border-gray-100 hover:shadow-md">
                            
                            {/* 강의 썸네일 영역 */}
                            <div className={`h-30 w-full rounded-t-2xl relative ${!course.bgImage && 'bg-sky-200'}`}>
                            {course.bgImage && (
                                <img src={course.bgImage} alt={course.title} className="w-full h-full object-cover" />
                            )}
                            <span className="absolute top-3 left-3 bg-[#FFF3E0] text-[#FF9800] text-xs font-bold px-3 py-1 rounded-lg">
                                {course.tag}
                            </span>
                            </div>

                            {/* 강의 정보 */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-base text-[#0A1628]">
                                {course.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                                <span>⏱️ {course.duration}</span>
                                <span>📊 {course.level}</span>
                                </div>
                            </div>

                            {/* 별점 */}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-amber-400 text-xs font-semibold">⭐ {course.rating.toFixed(1)}</span>
                                <span className="font-bold text-base text-[#439A97]">{course.price}</span>
                            </div>
                            </div>

                        </div>
                        ))}
                    </div>
                    

                    {/* 버튼 */}
                    <div className="flex gap-4 pt-6">
                    <button 
                        onClick={() => router.push(`/classroom/${continentid}/${countryid}`)}
                        className="flex-1 bg-white border border-gray-200 text-[#0A1628] h-16 rounded-3xl font-bold hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-2">
                        <img src="/images/Book.svg" alt="책" /> 
                        단과 강의실에서 자유롭게 선택
                    </button>
                    
                    <button 
                        onClick={() => router.push('/classroom/packagelounge')}
                        className="flex-1 bg-[#D35400] text-white h-16 rounded-2xl font-bold hover:bg-[#BA4A00] cursor-pointer flex items-center justify-center gap-2"
                    >
                        <img src="/images/AirplaneWhite.svg" alt="비행기"/> 페이지 메인으로 이동
                    </button>
                    </div>
                </div>
                </div>
    );
}