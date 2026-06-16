import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RefundFormClient from "@/features/csadmin/refund/components/RefundFormClient";

type RefundEditPageProps = {
  params: Promise<{
    refundid: string;
  }>;
};

export const metadata: Metadata = {
  title: "환불 요청 처리 | 알고가 CS 관리자",
  description: "환불 요청의 승인, 반려, 완료 상태를 처리합니다.",
};

export default async function RefundEditPage({ params }: RefundEditPageProps) {
  const { refundid } = await params;

  if (!/^\d+$/.test(refundid)) {
    notFound();
  }

  const refundId = Number(refundid);

  if (!Number.isSafeInteger(refundId) || refundId <= 0) {
    notFound();
  }

  return <RefundFormClient mode="edit" refundId={refundId} />;
}