"use client";

import { useMemo, useState, useEffect } from "react";
import { DiagnosisLevel, DiagnosisResult } from "../types";
import { RecommendedCourse } from "../evaluationResult.types";
import { findLatestDiagnosisResult } from "../services/evaluationResult.service";
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
  resultId?: string | null;
}

export function useEvaluationResult({
  continentCode,
  countryId,
  resultId,
}: UseEvaluationResultParams) {
  const pathContinentCode = toContinentPathCode(continentCode);

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadResult = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setResult(null);

        // 현재 사용자의 최신 결과를 조회
        const latestResult = await findLatestDiagnosisResult({
          countryId,
          resultId,
        });

        if (!active) return;

        if (!latestResult) {
          setErrorMessage(
            "진단평가 결과를 찾을 수 없습니다. 먼저 진단평가를 완료해 주세요."
          );
          return;
        }

        setResult(latestResult);
      } catch (error) {
        if (!active) return;

        console.error("[diagnosis-result] 결과 조회 실패:", error);

        setErrorMessage(
          "진단평가 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadResult();

    return () => {
      active = false;
    };
  }, [countryId, resultId]);

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
    isLoading,
    errorMessage,
    courseListHref,
  };
}