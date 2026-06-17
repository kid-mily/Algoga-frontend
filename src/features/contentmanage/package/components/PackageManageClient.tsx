"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import Link from "next/link";
import { useState } from "react";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useAdminPackageList } from "../hooks/useAdminPackageList";
import { TravelPackage } from "../types";
import PackageTable from "./PackageTable";
import PackageToolbar from "./PackageToolbar";

export default function PackageManageClient() {
  const {
    filteredPackages,
    searchKeyword,
    totalCount,
    isLoading,
    error,
    setSearchKeyword,
    removePackage,
  } = useAdminPackageList();
  const [deleteTarget, setDeleteTarget] = useState<TravelPackage | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const success = await removePackage(deleteTarget.packageId);
    setDeleteTarget(null);

    if (success) {
      setCompleteOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <SimpleSubHeader
          title="패키지 관리"
          description={`등록된 패키지 ${totalCount}건을 관리합니다`}
        />

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/contentadmin/accommodations"
            style={{ width: 134, minWidth: 134, height: 46, boxSizing: "border-box" }}
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[14px] border border-[#E4E7EC] bg-white text-[15px] font-semibold text-[#344054]"
          >
            숙소 관리
          </Link>
          <Link
            href="/contentadmin/package/new"
            style={{ width: 134, minWidth: 134, height: 46, boxSizing: "border-box" }}
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[14px] bg-[#439A97] text-[15px] font-semibold text-white transition hover:opacity-90"
          >
            패키지 등록
          </Link>
        </div>
      </header>

      <AdminErrorBanner message={error} className="mb-4" />

      <PackageToolbar
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
      />

      <PackageTable
        packages={filteredPackages}
        isLoading={isLoading}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={Boolean(deleteTarget)}
        title="패키지 삭제"
        description={`${deleteTarget?.name || "선택한 패키지"}를 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <CompleteModal
        open={completeOpen}
        title="삭제 완료"
        description="패키지가 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => setCompleteOpen(false)}
      />
    </main>
  );
}
