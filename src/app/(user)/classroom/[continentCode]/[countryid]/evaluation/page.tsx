import { redirect } from "next/navigation";
import EvaluationPageClient from "@/features/classroom/evaluation/EvaluationPageClient";
import { getDiagnosisQuestions } from "@/features/services/evaluation.service";
import { getServerAuthHeaders } from "@/lib/serverAuthHeaders";
import { ApiRequestError } from "@/lib/api";
import type { EvaluationFormQuestion } from "@/features/classroom/evaluation/types";

interface EvaluationPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

const NO_QUESTIONS_MESSAGE = "아직 이 국가의 진단평가 문제가 준비되지 않았습니다.";

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  const { continentCode, countryid } = await params;
  const pathContinentCode = continentCode.trim().toLowerCase();

  if (continentCode !== pathContinentCode) {
    redirect(`/classroom/${pathContinentCode}/${countryid}/evaluation`);
  }

  let questions: EvaluationFormQuestion[] = [];
  let errorMessage = "";
  let requiresLogin = false;

  try {
    questions = await getDiagnosisQuestions(
      countryid,
      undefined,
      await getServerAuthHeaders()
    );

    if (questions.length === 0) {
      errorMessage = NO_QUESTIONS_MESSAGE;
    }
  } catch (error) {
    console.error("[diagnosis] 진단평가 문제 조회 실패:", error);

    if (error instanceof ApiRequestError) {
      if (error.status === 401) {
        requiresLogin = true;
      } else if (error.status === 404) {
        errorMessage = NO_QUESTIONS_MESSAGE;
      } else if (error.status && error.status >= 500) {
        errorMessage = "잠시 후 다시 시도해 주세요. 진단평가 정보를 불러오지 못했습니다.";
      } else {
        errorMessage = error.message || "진단평가 정보를 불러오지 못했습니다.";
      }
    } else {
      errorMessage = "네트워크 상태를 확인한 뒤 다시 시도해 주세요.";
    }
  }

  return (
    <EvaluationPageClient
      key={countryid}
      continentCode={pathContinentCode}
      countryId={countryid}
      questions={questions}
      errorMessage={errorMessage}
      requiresLogin={requiresLogin}
    />
  );
}