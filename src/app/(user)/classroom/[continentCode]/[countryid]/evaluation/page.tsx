import { redirect } from "next/navigation";
import EvaluationPageClient from "@/features/classroom/evaluation/EvaluationPageClient";

interface EvaluationPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  const { continentCode, countryid } = await params;
  const pathContinentCode = continentCode.trim().toLowerCase();

  if (continentCode !== pathContinentCode) {
    redirect(`/classroom/${pathContinentCode}/${countryid}/evaluation`);
  }

  return (
    <EvaluationPageClient
      continentCode={pathContinentCode}
      countryId={countryid}
    />
  );
}