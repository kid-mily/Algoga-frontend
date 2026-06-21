import EvaluationResultContent from "@/features/classroom/evaluation/EvaluationResultContent";
import { getDiagnosisQuestions } from "@/features/services/evaluation.service";
import type { EvaluationFormQuestion } from "@/features/classroom/evaluation/types";

export const revalidate = 1800;

interface EvaluationResultPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export default async function EvaluationResultPage({
  params,
}: EvaluationResultPageProps) {
  const { continentCode, countryid } =
    await params;

  let questions: EvaluationFormQuestion[] = [];

  try {
    questions =
      await getDiagnosisQuestions(countryid);
  } catch (error) {
    console.error(
      "문제 조회 실패:",
      error
    );
  }

  return (
    <EvaluationResultContent
      continentCode={continentCode}
      countryId={countryid}
      questions={questions}
    />
  );
}