import EvaluationForm from "@/features/classroom/evaluation/EvaluationForm";
import { getDiagnosisQuestions } from "@/features/services/evaluation.service";

export const revalidate = 1800;

interface EvaluationPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  const { continentCode, countryid } = await params;

  const questions = await getDiagnosisQuestions(countryid);

  return (
    <EvaluationForm
      continentCode={continentCode}
      countryId={countryid}
      questions={questions}
    />
  );
}