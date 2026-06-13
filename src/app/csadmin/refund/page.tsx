import type { Metadata } from "next";
import CsRefundManageClient from "@/features/csadmin/refund/components/CsRefundManageClient";
import { mockCsRefunds } from "@/features/csadmin/refund/types";

export const metadata: Metadata = {
  title: "환불 요청 관리 | 알고가 CS 관리자",
  description: "환불 요청을 검색, 필터링하고 등록, 수정, 삭제하는 CS 관리자 화면입니다.",
};

export default function RefundPage() {
  return <CsRefundManageClient initialRefunds={mockCsRefunds} />;
}