// @/app/classroom/[continentCode]/[countryCode]/page.tsx
'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TabNavigation from "@/features/classroom/TabNavigation";
import SubHeader from "@/features/contentmanage/SubHeader";
import { CourseItem } from "@/features/classroom/types";
import { getCourse } from "@/features/services/lectureSelect.service";

export default function LectureListPage() {
  const params = useParams();
  const router = useRouter(); 

  // 1. URL 파라미터 디코딩
  const continentCode = params.continentCode ? decodeURIComponent(params.continentCode as string) : "";
  const countryCode = params.countryCode ? decodeURIComponent(params.countryCode as string) : "";

  // 난이도 색상
  const levelColor: Record<string, string> = {
    초급: 'bg-[#4A6B6B]',
    중급: 'bg-[#D9A752]',
    고급: 'bg-[#C95B5B]',
  };

  const [lectures, setLectures] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 디코딩된 값이 없을 때는 API를 호출하지 않음
    if (!countryCode) return;

    const fetchLectures = async () => {
      try {
        setIsLoading(true);
        // 디코딩된 올바른 나라 코드(이름)를 API에 전달
        const resData = await getCourse(countryCode);
        
        // 2. 방어 코드: resData.data가 정상적인 배열인지 확실히 체크 (.map 에러 방지)
        if (resData && Array.isArray(resData.data)) {
          setLectures(resData.data);
        } else {
          // 데이터가 배열이 아니거나 비어있을 경우 안전하게 빈 배열 세팅
          setLectures([]); 
        }
      } catch (err: any) {
        // 3. 에러 처리 방어 코드 (Axios, Fetch 모두 대응)
        const errorMessage = err?.response?.data?.message || err?.message || "강의 목록을 불러오지 못했습니다.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, [countryCode]);

  if (isLoading) return <div className="p-10 text-center text-sm text-gray-500">강의 정보를 불러오는 중입니다...</div>;
  if (error) return <div className="p-10 text-center text-sm text-red-500">오류가 발생했습니다: {error}</div>;

  return (
    <div className="w-full min-h-screen p-10 bg-[#f5f6f8]">
      <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">

        {/* 헤더 */}
        <SubHeader
          backHref={`/classroom/${continentCode}`}
          backText="나라 선택으로 돌아가기"
          title={`${countryCode} 여행`}
          description="원하는 학습 방식을 선택하세요"
        />

        {/* 단과 / 패키지 탭 */}
        <TabNavigation />
        
        {/* 배너 */}
        <div className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* 아이콘 */}
            <div className="w-12 h-12 bg-[#EEF5FF] rounded-2xl flex items-center justify-center text-xl">📝</div>
            {/* 텍스트 */}
            <div>
              <h3 className="font-bold text-[#0A1628] text-sm">내 실력 확인하고 추천받기</h3>
              <p className="text-xs text-[#8A94A6] mt-1">진단 평가로 나에게 맞는 강의를 찾아보세요</p>
            </div>
          </div>

          {/* 버튼 */}
          <button
            className="bg-[#439A97] text-white text-xs font-semibold px-5 py-4 rounded-2xl hover:bg-[#597777]"
            onClick={() => router.push(`/classroom/${continentCode}/${countryCode}/evaluation`)}
          >
            진단 평가 시작
          </button>
        </div>

        {/* 정렬 필터 */}
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50">인기순</button>
          <button className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50">별점 높은 순</button>
          <button className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50">가격 높은 순</button>
        </div>

        {/* 강의 수 */}
        <div className="mb-3">
          <p className="flex items-center mt-5 mb-4 text-sm font-bold text-[#0A1628]">
            {countryCode} 강좌 목록
            <span className="ml-2 text-sm font-bold text-[#8A9BB0]">({lectures.length}개)</span>
          </p>
        </div>

        {/* 강의 카드 */}
        <div 
          className="w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px",
          }}
        >
          {lectures.map((lecture) => (
            <Link 
              key={lecture.courseId} 
              href={`/classroom/${continentCode}/${countryCode}/lecture/${lecture.courseId}`}
              className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md cursor-pointer"
            >
              
              {/* 이미지 영역 */}
              <div className="relative w-full h-[160px]">
                <img src={lecture.thumbnailUrl} alt={lecture.title} className="w-full h-full object-cover" />
                {/* 난이도 배지 */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${levelColor[lecture.levelName] || 'bg-gray-500'}`}>
                  {lecture.levelName}
                </span>
              </div>

              {/* 강의 카드 본문 */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  {/* 제목 */}
                  <h4 className="font-bold text-[#0A1628]">{lecture.title}</h4>
                  {/* 정보 */}
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-[#8A94A6] mt-4">
                    <div className="flex items-center gap-1">⏱️ 30일</div>
                    <div className="flex items-center gap-1">👤 0명</div>
                    <div className="flex items-center gap-1">⭐ 0.0</div>
                    <div className="flex items-center gap-1">👨‍🏫 전문 강사</div>
                  </div>
                </div>

                {/* 가격 */}
                <div className="flex justify-between items-center mt-5 border-t border-gray-50 pt-3">
                  <p className="text-[#439A97] font-bold text-xl">{lecture.price?.toLocaleString()}원</p>
                  <p className="text-xs text-[#8A94A6] bg-[#F5F7FA] px-2 py-1 rounded-md">30일 수강권</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}