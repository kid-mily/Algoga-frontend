"use client";

import { useRouter } from "next/navigation";
import EvaluationResultEmpty from "./components/EvaluationResultEmpty";
import EvaluationResultHero from "./components/EvaluationResultHero";
import RecommendedCourseList from "./components/RecommendedCourseList";
import { useEvaluationResult } from "./hooks/useEvaluationResult";
import type { RecommendedCourse } from "./evaluationResult.types";
import { saveSelectedRecommendedCourse } from "./utils/evaluationResult.storage";
import { LEVEL_STYLES } from "./utils/evaluationResult.util";

interface EvaluationResultContentProps {
  continentCode: string;
  countryId: string;
}

export default function EvaluationResultContent({
  continentCode,
  countryId,
}: EvaluationResultContentProps) {
  const router = useRouter();

  const {
    pathContinentCode,
    result,
    questions,
    levelMatchedCourses,
    selectedCourseId,
    setSelectedCourseId,
    isLoading,
    isRecommendationLoading,
    errorMessage,
    courseListHref,
  } = useEvaluationResult({
    continentCode,
    countryId,
  });

  const handleSingleCourseClick = (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);
    saveSelectedRecommendedCourse(course, pathContinentCode, countryId);

    const lectureHref =
      `/classroom/${pathContinentCode}/${countryId}/lecture/${course.courseId}`;

    const nextHref =
      course.enrolled || course.paid ? `${lectureHref}/study` : lectureHref;

    router.push(nextHref);
  };

  const handlePackageClick = (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);
    saveSelectedRecommendedCourse(course, pathContinentCode, countryId);

    const packageLoungeHref =
      `/packagelounge?countryId=${course.countryId || countryId}` +
      `&courseId=${course.courseId}` +
      `&continentCode=${encodeURIComponent(pathContinentCode)}`;

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
      <EvaluationResultEmpty
        errorMessage={errorMessage}
        courseListHref={courseListHref}
      />
    );
  }

  const levelStyle = LEVEL_STYLES[result.level] ?? LEVEL_STYLES.BEGINNER;
  const levelName = result.levelName || levelStyle.label;

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-[#F4F7FB] px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <EvaluationResultHero result={result} questions={questions} />

        <RecommendedCourseList
          levelName={levelName}
          courses={levelMatchedCourses}
          selectedCourseId={selectedCourseId}
          isLoading={isRecommendationLoading}
          onSingleCourseClick={handleSingleCourseClick}
          onPackageClick={handlePackageClick}
        />
      </div>
    </main>
  );
}