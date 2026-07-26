import {
  DiagnosisResult,
  DiagnosisResultRequest,
  EvaluationAnswer,
  EvaluationFormQuestion,
} from "./types";
import { findLatestDiagnosisResult } from "./services/evaluationResult.service";
import { getMyCourses } from "@/features/services/myCourse.service";
import type { MyCourse } from "@/features/mypage/coursedetails/types";

export interface EvaluationResultInitialData {
  myCourses: MyCourse[];
  // null이면 "결과 없음"(정상적인 결과) — 진단평가를 아직 안 봤을 때
  diagnosisResult: DiagnosisResult | null;
}

// 진단평가 결과 페이지용 — 강의 구매 목록과 최신 진단평가 결과를 서버에서 함께 조회한다.
// 둘 중 하나라도 실패하면(네트워크/401 등) 그대로 던져서 페이지가 에러 화면을 보여준다.
export const loadEvaluationResultInitialData = async (
  countryId: string,
  resultId: string | null | undefined,
  headers?: HeadersInit
): Promise<EvaluationResultInitialData> => {
  const [myCoursesPage, diagnosisResult] = await Promise.all([
    getMyCourses(0, 100, headers),
    findLatestDiagnosisResult({ countryId, resultId }, headers),
  ]);

  return {
    myCourses: myCoursesPage.content,
    diagnosisResult,
  };
};

interface BuildDiagnosisPayloadParams {
    countryId: string;
    questions: EvaluationFormQuestion[];
    answers: EvaluationAnswer[];
}

export const buildDiagnosisResultPayload = ({
    countryId,
    questions,
    answers,
}: BuildDiagnosisPayloadParams):
    | DiagnosisResultRequest
    | null => {
    const numericCountryId = Number(countryId);

    if (
        !Number.isInteger(numericCountryId) ||
        numericCountryId <= 0 ||
        questions.length === 0
    ) {
        return null;
    }

    const orderedAnswers = questions.map(
        (question) =>
        answers.find(
            (answer) =>
            answer.questionId ===
            question.questionId
        )
    );

    if (
        orderedAnswers.some(
        (answer) =>
            !answer ||
            answer.selectedOption < 1 ||
            answer.selectedOption > 4
        )
    ) {
        return null;
    }

    return {
        countryId: numericCountryId,
        answers:
        orderedAnswers as EvaluationAnswer[],
    };
};