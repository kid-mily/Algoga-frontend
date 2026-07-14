import { redirect } from "next/navigation";
import EvaluationResultContent from "@/features/classroom/evaluation/EvaluationResultContent";

interface EvaluationResultPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
  searchParams: Promise<{
    resultId?: string;
  }>;
}

export default async function EvaluationResultPage({
  params,
  searchParams,
}: EvaluationResultPageProps) {
  const { continentCode, countryid } = await params;
  const { resultId } = await searchParams;

  const pathContinentCode = continentCode.trim().toLowerCase();

  if (continentCode !== pathContinentCode) {
    const query = resultId ? `?resultId=${encodeURIComponent(resultId)}` : "";

    redirect(
      `/classroom/${pathContinentCode}/${countryid}/evaluation/result${query}`
    );
  }

  return (
    <EvaluationResultContent
      continentCode={pathContinentCode}
      countryId={countryid}
      resultId={resultId}
    />
  );
}