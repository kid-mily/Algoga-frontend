"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TabNavigation from "@/features/classroom/TabNavigation";
import SubHeader from "@/features/contentmanage/SubHeader";
import { Country, CourseItem } from "@/features/classroom/types";
import { getCourse } from "@/features/services/lectureSelect.service";

const getParamValue = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function LectureListPage() {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParamValue(params.continentCode);
  const countryCode = getParamValue(params.countryCode);

  const [countryInfo, setCountryInfo] = useState<Country | null>(null);
  const [lectures, setLectures] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const levelColor: Record<string, string> = {
    초급: "bg-[#4A6B6B]",
    중급: "bg-[#D9A752]",
    고급: "bg-[#C95B5B]",
    BEGINNER: "bg-[#4A6B6B]",
    INTERMEDIATE: "bg-[#D9A752]",
    ADVANCED: "bg-[#C95B5B]",
  };

  useEffect(() => {
    if (!continentCode || !countryCode) {
      setIsLoading(false);
      return;
    }

    const fetchLectures = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getCourse(continentCode, countryCode);

        setCountryInfo(result.country);
        setLectures(result.courses);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "강의 목록을 불러오지 못했습니다.";

        setError(errorMessage);
        setCountryInfo(null);
        setLectures([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, [continentCode, countryCode]);

  const displayCountryName =
    countryInfo?.countryName || countryCode.toUpperCase();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen p-10 bg-[#f5f6f8]">
        <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8A94A6]">
            강의 정보를 불러오는 중입니다...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen p-10 bg-[#f5f6f8]">
        <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-red-500">
            오류가 발생했습니다: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-10 bg-[#f5f6f8]">
      <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">
        <SubHeader
          backHref={`/classroom/${continentCode}`}
          backText="나라 선택으로 돌아가기"
          title={`${displayCountryName} 여행`}
          description="원하는 학습 방식을 선택하세요"
        />

        <TabNavigation />

        <div className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#EEF5FF] rounded-2xl flex items-center justify-center text-xl">
              📝
            </div>

            <div>
              <h3 className="font-bold text-[#0A1628] text-sm">
                내 실력 확인하고 추천받기
              </h3>
              <p className="text-xs text-[#8A94A6] mt-1">
                진단 평가로 나에게 맞는 강의를 찾아보세요
              </p>
            </div>
          </div>

          <button
            className="bg-[#439A97] text-white text-xs font-semibold px-5 py-4 rounded-2xl hover:bg-[#597777]"
            onClick={() =>
              router.push(`/classroom/${continentCode}/${countryCode}/evaluation`)
            }
          >
            진단 평가 시작
          </button>
        </div>

        <div className="mb-3">
          <p className="flex items-center mt-5 mb-4 text-sm font-bold text-[#0A1628]">
            {displayCountryName} 강좌 목록
            <span className="ml-2 text-sm font-bold text-[#8A9BB0]">
              ({lectures.length}개)
            </span>
          </p>
        </div>

        {lectures.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-8 text-center text-sm text-[#8A94A6]">
            등록된 강의가 없습니다.
          </div>
        ) : (
          <div
            className="w-full"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "20px",
            }}
          >
            {lectures.map((lecture) => {
              const levelText = lecture.levelName || lecture.level;
              const levelClass = levelText
                ? levelColor[levelText] || "bg-gray-500"
                : "bg-gray-500";

              return (
                <Link
                  key={lecture.courseId}
                  href={`/classroom/${continentCode}/${countryCode}/lecture/${lecture.courseId}`}
                  className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="relative w-full h-[160px] bg-gray-100">
                    {lecture.thumbnailUrl ? (
                      <img
                        src={lecture.thumbnailUrl}
                        alt={lecture.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#8A94A6]">
                        썸네일 없음
                      </div>
                    )}

                    {levelText && (
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${levelClass}`}
                      >
                        {levelText}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="font-bold text-[#0A1628] line-clamp-2">
                        {lecture.title}
                      </h4>

                      {lecture.description && (
                        <p className="mt-3 text-xs text-[#8A94A6] line-clamp-2">
                          {lecture.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-5 border-t border-gray-50 pt-3">
                      <p className="text-[#439A97] font-bold text-xl">
                        {typeof lecture.price === "number"
                          ? `${lecture.price.toLocaleString()}원`
                          : "가격 정보 없음"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}