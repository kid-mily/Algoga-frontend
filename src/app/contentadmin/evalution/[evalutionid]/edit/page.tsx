import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EvalutionFormClient from "@/features/contentmanage/evalution/components/EvalutionFormClient";

type EditEvalutionPageProps = {
  params: Promise<{
    evalutionid: string;
  }>;
};

export const metadata: Metadata = {
  title: "진단평가 문제 수정 | 알고가 관리자",
  description: "등록된 진단평가 문제와 선택지를 수정합니다.",
};

export default async function EditEvalutionPage({
  params,
}: EditEvalutionPageProps) {
  const { evalutionid } = await params;

  if (!/^\d+$/.test(evalutionid)) {
    notFound();
  }

  const questionId = Number(evalutionid);

  if (!Number.isSafeInteger(questionId) || questionId <= 0) {
    notFound();
  }

  return <EvalutionFormClient mode="edit" questionId={questionId} />;
}
