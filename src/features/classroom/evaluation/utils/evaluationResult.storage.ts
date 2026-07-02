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