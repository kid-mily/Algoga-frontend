import type { Metadata } from "next";
import EvalutionManageClient from "@/features/contentmanage/evalution/components/EvalutionManageClient";

export const metadata: Metadata = {
  title: "진단평가 관리 | 알고가 관리자",
  description:
    "진단평가 문제를 등록, 수정, 삭제하고 난이도와 국가별로 관리하는 관리자 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EvalutionPage() {
  return <EvalutionManageClient />;
}
