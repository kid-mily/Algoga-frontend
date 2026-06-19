import { DiagnosisResultRequest, EvaluationAnswer, EvaluationFormQuestion } from "./types";

export const buildDiagnosisResultPayload = ({ countryId, questions, answers }: {
    countryId: string;
    questions: EvaluationFormQuestion[];
    answers: EvaluationAnswer[];
    }): DiagnosisResultRequest | null => {
        const sortedAnswers = questions.map((question) =>
            answers.find((answer) => answer.questionId === question.questionId)
        ).filter((answer): answer is EvaluationAnswer => Boolean(answer));
        
        if (sortedAnswers.length !== questions.length) {
            return null;
        }
        
        return {
            countryId: Number(countryId),
            answers: sortedAnswers.map((answer) => ({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
        })),
    };
};