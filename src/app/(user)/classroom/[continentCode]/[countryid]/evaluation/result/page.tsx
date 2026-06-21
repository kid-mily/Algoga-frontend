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
  const { continentCode, countryid } =
    await params;

  return (
    <EvaluationResultContent
      continentCode={continentCode}
      countryId={countryid}
    />
  );
}