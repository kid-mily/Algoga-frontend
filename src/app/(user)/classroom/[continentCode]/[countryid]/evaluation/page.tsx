// 진단평가 페이지

import EvaluationForm from "@/features/classroom/evaluation/EvaluationForm";
import { getDiagnosisQuestions } from "@/features/services/evaluation.service";
import { notFound } from "next/navigation";

export const revalidate = 3;  // 300

interface EvaluationPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  const { continentCode, countryid } = await params;

  // API로 받아온 진단평가 문항을 저장할 변수
  let questions;
  try{
    questions = await getDiagnosisQuestions(countryid);
  } catch (error) {
    console.error("진단평가 문항 조회 실패:", error);
    notFound();

  }
  return (
    <EvaluationForm
      continentCode={continentCode}
      countryId={countryid}
      questions={questions}
    />
  );
}