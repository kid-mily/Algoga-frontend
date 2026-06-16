import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PointDetailClient from "@/features/contentmanage/point/components/PointDetailClient";

interface PointDetailPageProps {
  params: Promise<{
    studentid: string;
  }>;
}

export const metadata: Metadata = {
  title: "마일리지 상세 내역 | 알고가 관리자",
  description: "사용자 마일리지 지급, 회수, 사용 내역을 확인합니다.",
};

export default async function PointDetailPage({ params }: PointDetailPageProps) {
  const { studentid } = await params;

  if (!/^\d+$/.test(studentid)) {
    notFound();
  }

  const studentId = Number(studentid);

  if (!Number.isSafeInteger(studentId) || studentId <= 0) {
    notFound();
  }

  return <PointDetailClient studentId={studentId} />;
}
