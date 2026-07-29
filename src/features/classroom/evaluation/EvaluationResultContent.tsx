"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CompletionRequiredToast from "./components/CompletionRequiredToast";
import EvaluationResultEmpty from "./components/EvaluationResultEmpty";
import EvaluationResultHero from "./components/EvaluationResultHero";
import RecommendedCourseList from "./components/RecommendedCourseList";
import { useEvaluationResult } from "./hooks/useEvaluationResult";
import  { RecommendedCourse } from "./evaluationResult.types";
import { LEVEL_STYLES } from "./utils/evaluationResult.util";
import { isMyCourseCompleted } from "@/features/services/myCourse.service";
import type { EvaluationResultInitialData } from "./actions";

interface EvaluationResultContentProps {
  continentCode: string;
  countryId: string;
  initialData: EvaluationResultInitialData;
}

export default function EvaluationResultContent({
  continentCode,
  countryId,
  initialData,
}: EvaluationResultContentProps) {
  const router = useRouter();
  // 클릭한 그 강의를 이미 구매했는데 완강하지 않아 패키지로 못 넘어갈 때 보여줄 안내.
  // null이면 안 뜬 상태, 문자열이면 그 강의명을 토스트에 보여줌
  const [completionBlockedCourseName, setCompletionBlockedCourseName] =
    useState<string | null>(null);

  // 진단평가 결과(GET /diagnosis/me/latest)의 enrolled/paid는 검증되지 않은 값이라 믿지 않고,
  // 실제 구매 내역(GET /my/courses)으로 다시 확인한다 — 결제 안 한 강의가 "수강 중"으로
  // 잘못 뜨던 문제(예약의 PENDING 문제와 같은 유형)를 막기 위함
  const myCourses = initialData.myCourses;

  const purchasedCourseIds = useMemo(
    () => new Set(myCourses.map((course) => course.courseId)),
    [myCourses]
  );

  const {
    pathContinentCode,
    result,
    levelMatchedCourses,
    otherLevelGroups,
    selectedCourseId,
    setSelectedCourseId,
    errorMessage,
    courseListHref,
  } = useEvaluationResult({
    continentCode,
    countryId,
    initialResult: initialData.diagnosisResult,
  });

  const handleSingleCourseClick = (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);

    const lectureHref =
      `/classroom/${pathContinentCode}/${countryId}/lecture/${course.courseId}`;

    // course.enrolled/course.paid(진단평가 응답 값)는 검증되지 않아 믿지 않고,
    // 실제 구매 내역(purchasedCourseIds)으로 판단한다
    const nextHref = purchasedCourseIds.has(course.courseId)
      ? `${lectureHref}/study`
      : lectureHref;

    router.push(nextHref);
  };

  const handlePackageClick = (course: RecommendedCourse) => {
    setSelectedCourseId(course.courseId);
    setCompletionBlockedCourseName(null);

    // 나라 단위가 아니라 지금 클릭한 이 강의 자체를 이미 구매했는데 완강 안 했는지만 본다
    const matchedCourse = myCourses.find(
      (myCourse) => myCourse.courseId === course.courseId
    );

    if (matchedCourse && !isMyCourseCompleted(matchedCourse)) {
      setCompletionBlockedCourseName(matchedCourse.title);
      return;
    }

    const packageCountryId = course.countryId ?? Number(countryId);
    const packageLoungeHref =
      `/packagelounge?countryId=${encodeURIComponent(String(packageCountryId))}` +
      `&courseId=${encodeURIComponent(String(course.courseId))}` +
      `&continentCode=${encodeURIComponent(pathContinentCode)}`;

    router.push(packageLoungeHref);
  };

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
          purchasedCourseIds={purchasedCourseIds}
          onSingleCourseClick={handleSingleCourseClick}
          onPackageClick={handlePackageClick}
        />
      </div>

      {completionBlockedCourseName && (
        <CompletionRequiredToast
          courseName={completionBlockedCourseName}
          onClose={() => setCompletionBlockedCourseName(null)}
        />
      )}
    </main>
  );
}