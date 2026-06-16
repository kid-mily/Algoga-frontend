import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RefundFormClient from "@/features/csadmin/refund/components/RefundFormClient";

type RefundDetailPageProps = {
  params: Promise<{
    refundid: string;
  }>;
};

export const metadata: Metadata = {
  title: "환불 검토 요청 | 알고가 CS 관리자",
  description: "취소 요청을 확인하고 환불 검토 요청을 등록합니다.",
};

export default async function RefundDetailPage({ params }: RefundDetailPageProps) {
  const { refundid } = await params;

  if (!/^\d+$/.test(refundid)) {
    notFound();
  }

  const refundId = Number(refundid);

  if (!Number.isSafeInteger(refundId) || refundId <= 0) {
    notFound();
  }

  return <RefundFormClient mode="create" refundId={refundId} />;
}
