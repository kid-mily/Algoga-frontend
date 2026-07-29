import { redirect } from "next/navigation";
import EvaluationResultContent from "@/features/classroom/evaluation/EvaluationResultContent";
import EvaluationResultEmpty from "@/features/classroom/evaluation/components/EvaluationResultEmpty";
import { loadEvaluationResultInitialData } from "@/features/classroom/evaluation/actions";
import { getServerAuthHeaders } from "@/lib/serverAuthHeaders";
import { ApiRequestError } from "@/lib/api";

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

  const courseListHref = `/classroom/${pathContinentCode}/${countryid}`;

  let initialData: Awaited<
    ReturnType<typeof loadEvaluationResultInitialData>
  > | null = null;
  let loadError: unknown = null;

  try {
    initialData = await loadEvaluationResultInitialData(
      countryid,
      resultId,
      await getServerAuthHeaders()
    );
  } catch (error) {
    loadError = error;
  }

  if (loadError instanceof ApiRequestError && loadError.status === 401) {
    redirect(
      `/auth/login?redirect=${encodeURIComponent(
        `${courseListHref}/evaluation/result${resultId ? `?resultId=${encodeURIComponent(resultId)}` : ""}`
      )}`
    );
  }

  if (!initialData) {
    console.error("[evaluation-result] 결과 조회 실패:", loadError);

    return (
      <EvaluationResultEmpty
        errorMessage="진단평가 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        courseListHref={courseListHref}
      />
    );
  }

  return (
    <EvaluationResultContent
      key={`${countryid}-${resultId ?? ""}`}
      continentCode={pathContinentCode}
      countryId={countryid}
      initialData={initialData}
    />
  );
}