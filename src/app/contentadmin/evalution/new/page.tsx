import type { Metadata } from "next";
import EvalutionFormClient from "@/features/contentmanage/evalution/components/EvalutionFormClient";

export const metadata: Metadata = {
  title: "진단평가 문제 등록 | 알고가 관리자",
  description: "새 진단평가 문제와 선택지를 등록합니다.",
};

export default function CreateEvalutionPage() {
  return <EvalutionFormClient mode="create" />;
}
