"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CompletionRequiredToast from "./components/CompletionRequiredToast";
import EvaluationResultEmpty from "./components/EvaluationResultEmpty";
import EvaluationResultHero from "./components/EvaluationResultHero";
import RecommendedCourseList from "./components/RecommendedCourseList";
import { useEvaluationResult } from "./hooks/useEvaluationResult";
import  { RecommendedCourse } from "./evaluationResult.types";
import { LEVEL_STYLES } from "./utils/evaluationResult.util";
import {
  getMyCourses,
  isMyCourseCompleted,
} from "@/features/services/myCourse.service";

interface EvaluationResultContentProps {
  continentCode: string;
  countryId: string;
  resultId?: string | null;
}

export default function EvaluationResultContent({
  continentCode,
  countryId,
  resultId,
}: EvaluationResultContentProps) {
  const router = useRouter();
  // 이미 구매한 강의를 완강하지 않아 패키지로 못 넘어갈 때 보여줄 안내 (BK_004와 같은 조건)
  const [completionBlocked, setCompletionBlocked] = useState(false);

  const {
    pathContinentCode,
    result,
    levelMatchedCourses,
    otherLevelGroups,
    selectedCourseId,
    setSelectedCourseId,
    isLoading,
    errorMessage,
    courseListHref,
  } = useEvaluationResult({
    continentCode,
    countryId,
    resultId,
  });

  const handleSingleCourseClick = (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);

    const lectureHref =
      `/classroom/${pathContinentCode}/${countryId}/lecture/${course.courseId}`;

    const nextHref =
      course.enrolled || course.paid ? `${lectureHref}/study` : lectureHref;

    router.push(nextHref);
  };

  const handlePackageClick = async (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);
    setCompletionBlocked(false);

    const packageCountryId = course.countryId ?? Number(countryId);

    // 백엔드(BK_004)와 같은 조건: 그 나라에서 이미 구매한 강의가 있는데 완강하지 않았으면 패키지로 못 넘어간다.
    // 아예 산 적 없는 나라는 통과(신규 구매는 패키지+강의 동시 구매로 처리됨)
    try {
      const { content } = await getMyCourses(0, 100);
      const purchasedInCountry = content.filter(
        (myCourse) => myCourse.countryId === packageCountryId
      );
      const hasIncompleteCourse = purchasedInCountry.some(
        (myCourse) => !isMyCourseCompleted(myCourse)
      );

      if (hasIncompleteCourse) {
        setCompletionBlocked(true);
        return;
      }
    } catch (error) {
      // 확인 자체가 실패해도 최종적으로는 예약 생성 시점(BK_004)에서 백엔드가 막아주므로 이동은 막지 않는다
      console.error("[evaluation] 완강 여부 확인 실패:", error);
    }

    const packageLoungeHref =
      `/packagelounge?countryId=${encodeURIComponent(String(packageCountryId))}` +
      `&courseId=${encodeURIComponent(String(course.courseId))}` +
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
        <EvaluationResultHero result={result} />

        <RecommendedCourseList
          levelName={levelName}
          courses={levelMatchedCourses}
          otherLevelGroups={otherLevelGroups}
          selectedCourseId={selectedCourseId}
          isLoading={false}
          onSingleCourseClick={handleSingleCourseClick}
          onPackageClick={handlePackageClick}
        />
      </div>

      {completionBlocked && (
        <CompletionRequiredToast onClose={() => setCompletionBlocked(false)} />
      )}
    </main>
  );
}