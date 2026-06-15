import EvaluationResultContent from "@/features/classroom/evaluation/EvaluationResultContent";
import type { DiagnosisLevel } from "@/features/classroom/evaluation/types";

interface EvaluationResultPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
  searchParams: Promise<{
    level?: string;
  }>;
}

const isDiagnosisLevel = (level?: string): level is DiagnosisLevel => {
  return (
    level === "BEGINNER" ||
    level === "INTERMEDIATE" ||
    level === "ADVANCED"
  );
};

export default async function EvaluationResultPage({
  params,
  searchParams,
}: EvaluationResultPageProps) {
  const { continentCode, countryid } = await params;
  const { level } = await searchParams;

  const fallbackLevel = isDiagnosisLevel(level) ? level : undefined;

  return (
    <EvaluationResultContent
      continentCode={continentCode}
      countryId={countryid}
      fallbackLevel={fallbackLevel}
    />
  );
}