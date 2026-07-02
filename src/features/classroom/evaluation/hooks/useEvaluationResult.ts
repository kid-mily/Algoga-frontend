"use client";

import { useEffect, useMemo, useState } from "react";
import type { DiagnosisResult, EvaluationFormQuestion } from "../types";
import type { RecommendedCourse } from "../evaluationResult.types";
import { getRecommendedCoursesFromResult } from "../services/evaluationResult.service";
import { loadStoredDiagnosisAttempt } from "../utils/evaluationResult.storage";
import { toContinentPathCode } from "../utils/evaluationResult.util";

interface UseEvaluationResultParams {
    continentCode: string;
    countryId: string;
}

export function useEvaluationResult({
    continentCode,
    countryId,
}: UseEvaluationResultParams) {
    const pathContinentCode = toContinentPathCode(continentCode);

    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [questions, setQuestions] = useState<EvaluationFormQuestion[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<
        RecommendedCourse[]
    >([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let active = true;

        const loadResult = async () => {
        try {
            const stored = loadStoredDiagnosisAttempt();

            if (!stored) {
            setErrorMessage("저장된 진단평가 결과가 없습니다.");
            return;
            }

            if (!active) return;

            setResult(stored.result);
            setQuestions(stored.questions);
            setIsRecommendationLoading(true);

            const courses = await getRecommendedCoursesFromResult(
            countryId,
            stored.result
            );

            if (!active) return;

            setRecommendedCourses(courses);
        } catch (error) {
            if (!active) return;

            console.error("[diagnosis-result] 결과 로딩 실패:", error);
            setErrorMessage("진단평가 결과를 불러오지 못했습니다.");
        } finally {
            if (active) {
            setIsLoading(false);
            setIsRecommendationLoading(false);
            }
        }
        };

        void loadResult();

        return () => {
        active = false;
        };
    }, [countryId]);

    const levelMatchedCourses = useMemo(() => {
        if (!result) return [];

        return recommendedCourses.filter((course) => course.level === result.level);
    }, [recommendedCourses, result]);

    const courseListHref = `/classroom/${pathContinentCode}/${countryId}`;

    return {
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
    };
}