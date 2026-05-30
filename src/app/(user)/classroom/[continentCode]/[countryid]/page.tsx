// 그 나라에 해당하는 강의 목록 페이지 (단과/패키지)
'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseItem } from "@/features/classroom/components/types";
import { getCourses } from "@/features/services/lectureSelect.service";
import LectureGrid from "@/features/classroom/components/LectureGrid";
import LecturePageHeader from "@/features/classroom/components/LecturePageHeader";
import EvaluationBanner from "@/features/classroom/components/EvaluationBanner";

const getParamValue = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function LectureListPage() {
  const params = useParams();
  const router = useRouter();

  // url 경로에서 대륙 코드와 국가 id 추출
  const continentCode = getParamValue(params.continentCode);
  const countryId = getParamValue(params.countryid);

  const [lectures, setLectures] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("countryId =", countryId);
    if (!countryId) {
      setIsLoading(false);
      return;
    }

    const fetchLectures = async () => {
      try {
        setIsLoading(true);   // 요청 시작 전 로딩 켬
        setError(null);   // 이전 요청의 에러 기록 초기화

        const courses = await getCourses(countryId);
        setLectures(courses);   // 서버에서 받은 데이터 상테에 업로드
      } catch (err: any) {
        // 백에서 보내준 에러 메시지를 우선적으로 보여주고, 없을 경우 기본 에러 메시지 출력
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "강의 목록을 불러오지 못했습니다.";

        setError(errorMessage);
        setLectures([]);    // 에러 발생 시 데이터가 화면에 렌더링 되지 않도록 배열 초기화
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, [countryId]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div className="p-10 w-full min-h-screen bg-[#f5f6f8]">
      <div className="w-full max-w-4xl mx-auto pt-4 px-4">
        {/* 상단 */}
        <LecturePageHeader continentCode={continentCode}/>

        {/* 진단 평가 */}
        <EvaluationBanner
          continentCode={continentCode}
          countryId={countryId}
        />

        {/* 강의 목록 */}
        <LectureGrid 
          lectures={lectures}
          continentCode={continentCode}
          countryId={countryId}
        />
      </div>
    </div>
  );
}