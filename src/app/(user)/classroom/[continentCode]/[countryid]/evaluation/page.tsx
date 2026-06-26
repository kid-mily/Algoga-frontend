import EvaluationPageClient from "@/features/classroom/evaluation/EvaluationPageClient";

interface EvaluationPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export default async function EvaluationPage({
  params,
}: EvaluationPageProps) {
  const { continentCode, countryid } =
    await params;

  return (
    <EvaluationPageClient
      continentCode={continentCode}
      countryId={countryid}
    />
  );
}