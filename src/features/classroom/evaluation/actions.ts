import { DiagnosisResultRequest, EvaluationAnswer, EvaluationFormQuestion } from "./types";

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