"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import SubHeader from "@/features/common/components/SubHeader";
import { useAdminPointHistory } from "../hooks/useAdminPointHistory";
import PointHistoryTable from "./PointHistoryTable";
import PointPagination from "./PointPagination";

interface PointDetailClientProps {
  studentId: number;
}

export default function PointDetailClient({
  studentId,
}: PointDetailClientProps) {
  const { logs, currentPage, totalPages, isLoading, error, setCurrentPage } =
    useAdminPointHistory(studentId);

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/point"
        backText="마일리지 목록으로 돌아가기"
        title={`마일리지 상세 사용 내역 (유저 ID: ${studentId})`}
      />

      <AdminErrorBanner message={error} className="mt-4" />

      <PointHistoryTable logs={logs} isLoading={isLoading} />

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PointPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </main>
  );
}
