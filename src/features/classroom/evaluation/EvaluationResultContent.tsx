"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api, ApiResponse } from "@/lib/api";
import {
  DiagnosisAttempt,
  DiagnosisLevel,
  DiagnosisRecommendedCourse,
  DiagnosisResult,
  EvaluationFormQuestion,
  DIAGNOSIS_ATTEMPT_STORAGE_KEY,
  DIAGNOSIS_RESULT_STORAGE_KEY,
} from "./types";

interface EvaluationResultContentProps {
  continentCode: string;
  countryId: string;
}

interface RecommendedCourseFile {
  fileUrl: string;
  originalFileName: string;
  fileOrder: number;
}

type RecommendedCourse = DiagnosisRecommendedCourse & {
  fileUrls?: string[];
  files?: RecommendedCourseFile[];
};

const SELECTED_RECOMMENDED_COURSE_KEY = "selected-diagnosis-recommended-course";

const LEVEL_STYLES: Record<
  DiagnosisLevel,
  {
    label: string;
    background: string;
    text: string;
    border: string;
  }
> = {
  BEGINNER: {
    label: "초급",
    background: "bg-[#EAF7F6]",
    text: "text-[#357A78]",
    border: "border-[#BFE4E0]",
  },
  INTERMEDIATE: {
    label: "중급",
    background: "bg-[#FFF4DF]",
    text: "text-[#A56B16]",
    border: "border-[#F1D39A]",
  },
  ADVANCED: {
    label: "고급",
    background: "bg-[#FDECEC]",
    text: "text-[#B54747]",
    border: "border-[#F2C4C4]",
  },
};

const getCourseLevelStyle = (level?: DiagnosisLevel) => {
  if (level === "BEGINNER") {
    return {
      background: "bg-[#EAF7F6]",
      text: "text-[#357A78]",
    };
  }

  if (level === "ADVANCED") {
    return {
      background: "bg-[#FDECEC]",
      text: "text-[#B54747]",
    };
  }

  return {
    background: "bg-[#FFF4DF]",
    text: "text-[#A56B16]",
  };
};

const formatPrice = (price: number) => {
  if (price === 0) return "무료";

  return `${price.toLocaleString("ko-KR")}원`;
};

const getRecommendedCourses = async (
  countryId: string,
  level: DiagnosisLevel
): Promise<RecommendedCourse[]> => {
  const response = await api.get<ApiResponse<RecommendedCourse[]>>(
    "/api/v1/diagnosis/recommendations",
    {
      params: {
        countryId,
        level,
      },
      cache: "no-store",
      suppressGlobalError: true,
    }
  );

  return response.data ?? [];
};

const getRecommendedCoursesFromResult = async (
  countryId: string,
  result: DiagnosisResult
): Promise<RecommendedCourse[]> => {
  if (
    Array.isArray(result.recommendedCourses) &&
    result.recommendedCourses.length > 0
  ) {
    return result.recommendedCourses;
  }

  return getRecommendedCourses(countryId, result.level);
};

const saveSelectedCourse = (
  course: RecommendedCourse,
  continentCode: string,
  countryId: string
) => {
  sessionStorage.setItem(
    SELECTED_RECOMMENDED_COURSE_KEY,
    JSON.stringify({
      courseId: course.courseId,
      countryId,
      continentCode,
      title: course.title,
      level: course.level,
      levelName: course.levelName,
      selectedAt: new Date().toISOString(),
    })
  );
};

export default function EvaluationResultContent({
  continentCode,
  countryId,
}: EvaluationResultContentProps) {
  const router = useRouter();

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [questions, setQuestions] = useState<EvaluationFormQuestion[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<
    RecommendedCourse[]
  >([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRecommendationLoading, setIsRecommendationLoading] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadResult = async () => {
      try {
        const storedAttempt = sessionStorage.getItem(
          DIAGNOSIS_ATTEMPT_STORAGE_KEY
        );

        if (storedAttempt) {
          const attempt = JSON.parse(storedAttempt) as DiagnosisAttempt;

          setResult(attempt.result);
          setQuestions(attempt.questions ?? []);
          setIsRecommendationLoading(true);

          const courses = await getRecommendedCoursesFromResult(
            countryId,
            attempt.result
          );

          setRecommendedCourses(courses);
          return;
        }

        const storedResult = sessionStorage.getItem(
          DIAGNOSIS_RESULT_STORAGE_KEY
        );

        if (storedResult) {
          const parsedResult = JSON.parse(storedResult) as DiagnosisResult;

          setResult(parsedResult);
          setIsRecommendationLoading(true);

          const courses = await getRecommendedCoursesFromResult(
            countryId,
            parsedResult
          );

          setRecommendedCourses(courses);
          return;
        }

        setErrorMessage("저장된 진단평가 결과가 없습니다.");
      } catch (error) {
        console.error("[diagnosis-result] 결과 파싱 실패:", error);
        setErrorMessage("진단평가 결과를 읽을 수 없습니다.");
      } finally {
        setIsLoading(false);
        setIsRecommendationLoading(false);
      }
    };

    void loadResult();
  }, [countryId]);

  const courseListHref = `/classroom/${continentCode}/${countryId}`;

  const levelMatchedCourses = useMemo(() => {
    if (!result) return [];

    return recommendedCourses.filter((course) => course.level === result.level);
  }, [recommendedCourses, result]);

  const handleSingleCourseClick = (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);
    saveSelectedCourse(course, continentCode, countryId);

    const lectureHref = `/classroom/${continentCode}/${countryId}/lecture/${course.courseId}`;
    const nextHref = course.enrolled || course.paid ? `${lectureHref}/study` : lectureHref;

    router.push(nextHref);
  };

  const handlePackageClick = (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);
    saveSelectedCourse(course, continentCode, countryId);

    const packageLoungeHref =
      `/packagelounge?countryId=${course.countryId || countryId}` +
      `&courseId=${course.courseId}` +
      `&continentCode=${encodeURIComponent(continentCode)}`;

    router.push(packageLoungeHref);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F4F7FB] px-4">
        <section className="w-full max-w-sm rounded-[24px] border border-[#E1EAF0] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[#0A1628]">
            진단평가 결과를 불러오는 중입니다.
          </p>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F4F7FB] px-4">
        <section className="w-full max-w-md rounded-[28px] border border-[#E1EAF0] bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4DF] text-xl font-bold text-[#A56B16]">
            !
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#0A1628]">
            결과를 확인할 수 없습니다
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#8A9BB0]">
            {errorMessage}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <Link
              href={courseListHref}
              className="flex h-11 items-center justify-center rounded-xl border border-[#DCE5F0] bg-white text-sm font-bold text-[#243247]"
            >
              강의 목록
            </Link>

            <Link
              href={`${courseListHref}/evaluation`}
              className="flex h-11 items-center justify-center rounded-xl bg-[#D85F25] text-sm font-bold text-white"
            >
              다시 응시
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const levelStyle = LEVEL_STYLES[result.level] ?? LEVEL_STYLES.BEGINNER;

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-[#F4F7FB] px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <section className="overflow-hidden rounded-[32px] border border-[#D7E3EA] bg-white shadow-[0_18px_45px_rgba(52,79,98,0.12)]">
          <div className="grid md:grid-cols-[1fr_260px]">
            <div className="px-6 py-7 sm:px-9">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#EAF7F6] px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-[#357A78]">
                  ALGO BOARDING PASS
                </span>
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
                진단 평가 완료!
              </h1>

              <p className="mt-2 text-sm font-medium text-[#7C8A9A]">
                나에게 맞는 강의를 추천해드릴게요.
              </p>
            </div>

            <div className="flex min-h-[180px] items-center justify-center border-t border-[#E1EAF0] bg-[#F8FBFC] px-6 py-6 md:border-l md:border-t-0">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image
                    src="/images/medal.svg"
                    alt="진단 평가 완료"
                    width={32}
                    height={32}
                  />
                </div>

                <p className="mt-3 text-[11px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
                  ALGOGA
                </p>

                <p className="mt-1 text-xs font-bold text-[#439A97]">
                  알고 가는 여행
                </p>
              </div>
            </div>
          </div>

          <div className="relative border-t border-dashed border-[#D7E3EA]">
            <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-[#F4F7FB]" />
            <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-[#F4F7FB]" />
          </div>

          <div className="grid md:grid-cols-[1fr_260px]">
            <div className="flex min-h-[180px] items-center px-6 py-7 sm:px-9">
              <div>
                <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
                  BOARDING INFO
                </p>

                <h2 className="mt-2 text-lg font-extrabold text-[#0A1628]">
                  여행 학습 준비가 완료되었습니다.
                </h2>

                <p className="mt-2 text-sm font-medium text-[#7C8A9A]">
                  추천 강의에서 다음 여정을 시작해보세요.
                </p>

                {questions.length > 0 ? (
                  <p className="mt-3 text-xs font-semibold text-[#98A2B3]">
                    진단 문항 {questions.length}개 완료
                  </p>
                ) : null}
              </div>
            </div>

            <div
              className={`flex min-h-[180px] items-center justify-center border-t px-6 py-7 text-center md:border-l md:border-t-0 ${levelStyle.background} ${levelStyle.border}`}
            >
              <div>
                <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#98A2B3]">
                  YOUR LEVEL
                </p>

                <strong
                  className={`mt-4 block text-4xl font-extrabold ${levelStyle.text}`}
                >
                  {result.levelName || levelStyle.label}
                </strong>

                <p
                  className={`mx-auto mt-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold ${levelStyle.border} ${levelStyle.text}`}
                >
                  {result.levelName || levelStyle.label} 강의 추천
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#439A97]">
                RECOMMENDED CLASS
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-[#0A1628]">
                {result.levelName || levelStyle.label} 레벨 추천 강의
              </h2>

              <p className="mt-1 text-sm text-[#8A9BB0]">
                진단 결과와 같은 레벨의 강의를 모두 보여드려요.
              </p>
            </div>
          </div>

          {isRecommendationLoading ? (
            <div className="rounded-[24px] border border-[#E1EAF0] bg-white px-6 py-12 text-center text-sm font-bold text-[#8A9BB0] shadow-sm">
              추천 강의를 불러오는 중입니다.
            </div>
          ) : levelMatchedCourses.length === 0 ? (
            <div className="rounded-[24px] border border-[#E1EAF0] bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-bold text-[#0A1628]">
                현재 추천할 수 있는 강의가 없습니다.
              </p>

              <p className="mt-2 text-xs text-[#8A9BB0]">
                전체 강의 목록에서 원하는 강의를 선택해보세요.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {levelMatchedCourses.map((course) => {
                const purchased = course.enrolled || course.paid;
                const selected = selectedCourseId === course.courseId;
                const courseLevelStyle = getCourseLevelStyle(course.level);

                return (
                  <li
                    key={course.courseId}
                    className={`overflow-hidden rounded-[26px] border bg-white shadow-sm transition ${
                      selected
                        ? "border-[#439A97] ring-2 ring-[#439A97]/20"
                        : "border-[#E1EAF0]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSingleCourseClick(course)}
                      className="group block w-full text-left"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF2F5]">
                        {course.thumbnailUrl ? (
                          <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm font-bold text-[#7C8A9A]">
                            여행 이미지 없음
                          </div>
                        )}

                        <span
                          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-sm ${courseLevelStyle.background} ${courseLevelStyle.text}`}
                        >
                          {course.levelName}
                        </span>

                        {purchased ? (
                          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#439A97] shadow-sm">
                            수강 중
                          </span>
                        ) : null}
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-[#0A1628]">
                          {course.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8A9BB0]">
                          {course.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-[#EEF2F6] pt-4">
                          <strong className="text-sm font-extrabold text-[#0A1628]">
                            {formatPrice(course.price)}
                          </strong>

                          
                        </div>
                      </div>
                    </button>

                    <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                      <button
                        type="button"
                        onClick={() => handleSingleCourseClick(course)}
                        className="flex min-h-11 items-center justify-center rounded-2xl border border-[#DCE5F0] bg-white px-3 text-xs font-extrabold text-[#243247] transition hover:bg-[#F8FAFC]"
                      >
                        단과 선택
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePackageClick(course)}
                        className="flex min-h-11 items-center justify-center rounded-2xl bg-[#439A97] px-3 text-xs font-extrabold text-white transition hover:bg-[#377F7C]"
                      >
                        패키지 선택
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        <nav
          className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
          aria-label="진단평가 결과 이동"
        >
        </nav>
      </div>
    </main>
  );
}