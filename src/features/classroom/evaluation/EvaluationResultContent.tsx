"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DiagnosisLevel,
  DiagnosisResult,
  EvaluationFormQuestion,
  DIAGNOSIS_RESULT_STORAGE_KEY,
} from "./types";

interface EvaluationResultContentProps {
  continentCode: string;
  countryId: string;
  questions: EvaluationFormQuestion[];
}

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

const getCourseLevelStyle = (levelName?: string) => {
  if (levelName === "초급") {
    return {
      background: "bg-[#EAF7F6]",
      text: "text-[#357A78]",
    };
  }

  if (levelName === "고급") {
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

export default function EvaluationResultContent({
  continentCode,
  countryId,
}: EvaluationResultContentProps) {
  const [result, setResult] =
    useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    try {
      const storedResult = sessionStorage.getItem(
        DIAGNOSIS_RESULT_STORAGE_KEY
      );

      if (!storedResult) {
        setErrorMessage(
          "저장된 진단평가 결과가 없습니다."
        );
        return;
      }

      const parsedResult =
        JSON.parse(storedResult) as DiagnosisResult;

      if (
        !parsedResult ||
        typeof parsedResult.score !== "number" ||
        !Array.isArray(parsedResult.answers)
      ) {
        setErrorMessage(
          "진단평가 결과 형식이 올바르지 않습니다."
        );
        return;
      }

      setResult(parsedResult);
    } catch (error) {
      console.error(
        "[diagnosis-result] 결과 파싱 실패:",
        error
      );
      setErrorMessage(
        "진단평가 결과를 읽을 수 없습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const courseListHref =
    `/classroom/${continentCode}/${countryId}`;

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F4F7FB] px-4">
        <section className="w-full max-w-sm rounded-[24px] border border-[#E1EAF0] bg-white px-6 py-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF7F6]">
            <span
              className="text-xl"
              aria-hidden="true"
            >
              ✈
            </span>
          </div>

          <p className="mt-4 text-sm font-bold text-[#0A1628]">
            진단평가 결과를 불러오는 중입니다
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

  const levelStyle =
    LEVEL_STYLES[result.level] ??
    LEVEL_STYLES.BEGINNER;

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-[#F4F7FB] px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* 결과 티켓 */}
        <section className="overflow-hidden rounded-[32px] border border-[#D7E3EA] bg-white shadow-[0_18px_45px_rgba(52,79,98,0.12)]">
          {/* 티켓 상단 */}
          <div className="grid bg-white md:grid-cols-[1fr_220px]">
            <div className="px-6 py-7 sm:px-9">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#EAF7F6] px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-[#357A78]">
                  ALGO BOARDING PASS
                </span>

                <span
                  className="text-lg"
                  aria-hidden="true"
                >
                  ✈
                </span>
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
                진단 평가 완료!
              </h1>

              <p className="mt-2 text-sm font-medium text-[#7C8A9A]">
                나에게 맞는 강의를 추천해드릴게요.
              </p>
            </div>

            <div className="flex items-center justify-center border-t border-[#E1EAF0] bg-[#F8FBFC] px-6 py-6 md:border-l md:border-t-0">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image
                    src="/images/medal.svg"
                    alt="진단 평가 완료"
                    width={32}
                    height={32}
                  />
                </div>

                <p className="mt-2 text-xs font-bold tracking-[0.12em] text-[#98A2B3]">
                  ALGOGA
                </p>

                <p className="mt-1 text-xs font-bold text-[#439A97]">
                  알고 가는 여행
                </p>
              </div>
            </div>
          </div>

          {/* 티켓 절취선 */}
          <div className="relative border-t border-dashed border-[#D7E3EA]">
            <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-[#F4F7FB]" />
            <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-[#F4F7FB]" />
          </div>

          {/* 결과 본문 */}
          <div className="grid md:grid-cols-[1fr_260px]">
            <div className="px-6 py-7 sm:px-9">
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
                BOARDING INFO
              </p>

              <h2 className="mt-2 text-lg font-extrabold text-[#0A1628]">
                여행 학습 준비가 완료되었습니다
              </h2>
            </div>

            <div
              className={`border-t px-6 py-7 text-center md:border-l md:border-t-0 ${levelStyle.background} ${levelStyle.border}`}
            >
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
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
                맞춤 강의 추천 완료
              </p>
            </div>
          </div>
        </section>

        {/* 추천 강의 */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#439A97]">
                RECOMMENDED CLASS
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-[#0A1628]">
                지금 듣기 좋은 추천 강의
              </h2>
            </div>

            <Link
              href={courseListHref}
              className="shrink-0 rounded-full border border-[#D7E3EA] bg-white px-4 py-2 text-xs font-bold text-[#439A97] shadow-sm transition hover:bg-[#F8FBFC]"
            >
              전체 보기
            </Link>
          </div>

          {result.recommendedCourses.length === 0 ? (
            <div className="rounded-[24px] border border-[#E1EAF0] bg-white px-6 py-12 text-center text-sm text-[#8A9BB0] shadow-sm">
              현재 추천할 수 있는 강의가 없습니다.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.recommendedCourses.map(
                (course) => {
                  const purchased =
                    course.enrolled || course.paid;

                  const courseHref =
                    `/classroom/${continentCode}/${countryId}/lecture/${course.courseId}`;

                  const courseLevelStyle =
                    getCourseLevelStyle(
                      course.levelName
                    );

                  return (
                    <li key={course.courseId}>
                      <Link
                        href={
                          purchased
                            ? `${courseHref}/study`
                            : courseHref
                        }
                        className="group block h-full overflow-hidden rounded-[26px] border border-[#E1EAF0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF2F5]">
                          {course.thumbnailUrl ? (
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
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

                            <span className="text-xs font-extrabold text-[#439A97]">
                              {purchased
                                ? "강의 듣기"
                                : "상세 보기"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
          )}
        </section>

        {/* 하단 버튼 */}
        <nav
          className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
          aria-label="진단평가 결과 이동"
        >
          <Link
            href={courseListHref}
            className="flex min-h-12 items-center justify-center rounded-2xl border border-[#DCE5F0] bg-white px-4 text-sm font-extrabold text-[#0A1628] shadow-sm transition hover:bg-[#F8FAFC]"
          >
            단과 강의실에서 자유롭게 선택
          </Link>

          <Link
            href={`${courseListHref}/package`}
            className="flex min-h-12 items-center justify-center rounded-2xl bg-[#D85F25] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#C9551F]"
          >
            패키지 라운지로 이동
          </Link>
        </nav>
      </div>
    </main>
  );
}