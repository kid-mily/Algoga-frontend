import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReportDetailClient from "@/features/csadmin/report/components/ReportDetailClient";

export const metadata: Metadata = {
  title: "신고 상세 정보 | 알고가 CS 관리자",
  description: "신고 상세 정보를 확인하고 처리하는 CS 관리자 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

type ReportDetailPageProps = {
  params: Promise<{
    reportid: string;
  }>;
};

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { reportid } = await params;
  const reportId = Number(reportid);

  if (!reportid || !Number.isInteger(reportId) || reportId < 1) {
    notFound();
  }

  return <ReportDetailClient reportId={reportId} />;
}
