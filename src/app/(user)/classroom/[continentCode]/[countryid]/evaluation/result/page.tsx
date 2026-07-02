import { redirect } from "next/navigation";
import EvaluationResultContent from "@/features/classroom/evaluation/EvaluationResultContent";

interface EvaluationResultPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export default async function EvaluationResultPage({
  params,
}: EvaluationResultPageProps) {
  const { continentCode, countryid } = await params;
  const pathContinentCode = continentCode.trim().toLowerCase();

  if (continentCode !== pathContinentCode) {
    redirect(`/classroom/${pathContinentCode}/${countryid}/evaluation/result`);
  }

  return (
    <EvaluationResultContent
      continentCode={pathContinentCode}
      countryId={countryid}
    />
  );
}