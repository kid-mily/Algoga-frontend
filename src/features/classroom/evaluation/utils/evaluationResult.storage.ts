import type { DiagnosisAttempt, DiagnosisResult } from "../types";
import { DIAGNOSIS_ATTEMPT_STORAGE_KEY, DIAGNOSIS_RESULT_STORAGE_KEY } from "../types";
import type { RecommendedCourse } from "../evaluationResult.types";

const SELECTED_RECOMMENDED_COURSE_KEY = "selected-diagnosis-recommended-course";

export const loadStoredDiagnosisAttempt = () => {
    const storedAttempt = sessionStorage.getItem(DIAGNOSIS_ATTEMPT_STORAGE_KEY);

    if (storedAttempt) {
        const attempt = JSON.parse(storedAttempt) as DiagnosisAttempt;

        return {
        result: attempt.result,
        questions: attempt.questions ?? [],
        };
    }

    const storedResult = sessionStorage.getItem(DIAGNOSIS_RESULT_STORAGE_KEY);

    if (storedResult) {
        const result = JSON.parse(storedResult) as DiagnosisResult;

        return {
        result,
        questions: [],
        };
    }

    return null;
};

export const saveSelectedRecommendedCourse = (
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

export interface StoredRecommendedCourse {
    courseId: number;
    countryId: string;
    continentCode: string;
    title: string;
    level: string;
    levelName: string;
    selectedAt: string;
}

// 진단평가 완료 페이지에서 저장한, 사용자가 선택한 강의 정보를 읽어온다 (없으면 null)
export const getSelectedRecommendedCourse = (): StoredRecommendedCourse | null => {
    if (typeof window === "undefined") return null;

    const stored = sessionStorage.getItem(SELECTED_RECOMMENDED_COURSE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as StoredRecommendedCourse;
    } catch {
        return null;
    }
};