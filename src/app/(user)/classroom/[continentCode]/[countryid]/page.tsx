'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TabNavigation from "@/features/classroom/components/TabNavigation";
import SubHeader from "@/features/contentmanage/SubHeader";
import { CourseItem, LEVEL_COLORS } from "@/features/classroom/components/types";
import { getCourses } from "@/features/services/lectureSelect.service";

const getParamValue = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function LectureListPage() {
  const params = useParams();
  const router = useRouter();

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
        setIsLoading(true);
        setError(null);

        const courses = await getCourses(countryId);

        setLectures(courses);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "강의 목록을 불러오지 못했습니다.";

        setError(errorMessage);
        setLectures([]);
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
    <div>
      <SubHeader
        backHref={`/classroom/${continentCode}`}
        backText="나라 선택으로 돌아가기"
        title="강의 목록"
        description="원하는 학습 방식을 선택하세요"
      />

      <TabNavigation />

      <div className="grid grid-cols-3 gap-5">
        {lectures.map((lecture) => {
          const levelText = lecture.levelName || lecture.level;
          const levelClass =
            LEVEL_COLORS[levelText] || "bg-gray-500";

          return (
            <Link
              key={lecture.courseId}
              href={`/classroom/${continentCode}/${countryId}/lecture/${lecture.courseId}`}
              className="bg-white rounded-3xl overflow-hidden border"
            >
              <img
                src={lecture.thumbnailUrl}
                alt={lecture.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-5">
                <span
                  className={`text-white text-xs px-2 py-1 rounded ${levelClass}`}
                >
                  {levelText}
                </span>

                <h3 className="mt-3 font-bold">
                  {lecture.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {lecture.description}
                </p>

                <p className="mt-4 font-bold text-[#439A97]">
                  {lecture.price.toLocaleString()}원
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}