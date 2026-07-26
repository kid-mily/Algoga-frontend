"use client";

import { useMemo, useState } from "react";
import { DiagnosisLevel, DiagnosisResult } from "../types";
import { RecommendedCourse } from "../evaluationResult.types";
import { toContinentPathCode } from "../utils/evaluationResult.util";

// 상세 화면에 등급 섹션을 나열할 때 쓰는 고정 순서 (초급 -> 중급 -> 고급)
const LEVEL_ORDER: DiagnosisLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export interface OtherLevelCourseGroup {
  level: DiagnosisLevel;
  courses: RecommendedCourse[];
}

interface UseEvaluationResultParams {
  continentCode: string;
  countryId: string;
  // 서버(evaluation/result/page.tsx)에서 이미 조회한 결과. null이면 "결과 없음".
  initialResult: DiagnosisResult | null;
}

export function useEvaluationResult({
  continentCode,
  countryId,
  initialResult,
}: UseEvaluationResultParams) {
  const pathContinentCode = toContinentPathCode(continentCode);

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const result = initialResult;
  const errorMessage = result
    ? ""
    : "진단평가 결과를 찾을 수 없습니다. 먼저 진단평가를 완료해 주세요.";

  // recommendedCourses는 이미 내 등급으로 필터링되어 내려온다 (백엔드 응답 기준)
  const levelMatchedCourses = useMemo<RecommendedCourse[]>(() => {
    return result?.recommendedCourses ?? [];
  }, [result]);

  // otherLevelCourses(내 등급 제외 나머지 등급 단일 목록)를 등급 순서대로 묶어서 아래에 펼쳐 보여준다
  const otherLevelGroups = useMemo<OtherLevelCourseGroup[]>(() => {
    if (!result) return [];

    const otherCourses = result.otherLevelCourses ?? [];

    return LEVEL_ORDER.map((level) => ({
      level,
      courses: otherCourses.filter((course) => course.level === level),
    })).filter((group) => group.courses.length > 0);
  }, [result]);

  const courseListHref = `/classroom/${pathContinentCode}/${countryId}`;

  return {
    pathContinentCode,
    result,
    levelMatchedCourses,
    otherLevelGroups,
    selectedCourseId,
    setSelectedCourseId,
    errorMessage,
    courseListHref,
  };
}
