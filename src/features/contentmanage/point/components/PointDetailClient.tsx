"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import { useAdminPointHistory } from "../hooks/useAdminPointHistory";
import PointHistoryTable from "./PointHistoryTable";

interface PointDetailClientProps {
  studentId: number;
}

export default function PointDetailClient({
  studentId,
}: PointDetailClientProps) {
  const { logs, isLoading, error } = useAdminPointHistory(studentId);

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/point"
        backText="마일리지 목록으로 돌아가기"
        title={`마일리지 상세 사용 내역 (유저 ID: ${studentId})`}
      />

      <AdminErrorBanner message={error} className="mt-4" />

      <PointHistoryTable logs={logs} isLoading={isLoading} />
    </main>
  );
}
