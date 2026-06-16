import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CsInquiryDetailClient from "@/features/csadmin/inquiry/components/CsInquiryDetailClient";

type CsInquiryDetailPageProps = {
  params: Promise<{
    inquiryid: string;
  }>;
};

export const metadata: Metadata = {
  title: "고객 문의 상세 | 알고가 CS 관리자",
  description: "고객 문의 상세 내용과 답변 상태를 확인하고 답변을 등록합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CsInquiryDetailPage({
  params,
}: CsInquiryDetailPageProps) {
  const { inquiryid } = await params;

  if (!/^\d+$/.test(inquiryid)) {
    notFound();
  }

  const inquiryId = Number(inquiryid);

  if (!Number.isSafeInteger(inquiryId) || inquiryId <= 0) {
    notFound();
  }

  return <CsInquiryDetailClient inquiryId={inquiryId} />;
}
