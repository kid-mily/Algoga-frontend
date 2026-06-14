"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import { useRouter } from "next/navigation";
import { AdminManager } from "../types";
import { useManagerList } from "../hooks/useManagerList";
import ManagerDeleteModals from "./ManagerDeleteModals";
import ManagerTable from "./ManagerTable";
import ManagerToolbar from "./ManagerToolbar";

type ManagerManageClientProps = {
  initialManagers: AdminManager[];
};

export default function ManagerManageClient({
  initialManagers,
}: ManagerManageClientProps) {
  const router = useRouter();
  const {
    searchKeyword,
    selectedRole,
    filteredManagers,
    totalCount,
    deleteTarget,
    deleteCompleteOpen,
    isLoading,
    error,
    setSearchKeyword,
    setSelectedRole,
    setDeleteTarget,
    setDeleteCompleteOpen,
    deleteManager,
  } = useManagerList(initialManagers);

  return (
    <main aria-labelledby="manager-management-title">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1
            id="manager-management-title"
            className="text-[26px] font-bold text-[#111827]"
          >
            관리자 계정 관리
          </h1>
          <p className="mt-2 text-[14px] text-[#667085]">
            총 {totalCount}개의 관리자 계정
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/superadmin/manage/new")}
          className="flex h-[44px] items-center gap-2 rounded-[10px] bg-[#639E9B] px-5 text-[14px] font-semibold text-white"
        >
          <span aria-hidden="true" className="text-[18px] leading-none">
            +
          </span>
          계정 생성
        </button>
      </header>

      <ManagerToolbar
        searchKeyword={searchKeyword}
        selectedRole={selectedRole}
        onSearchKeywordChange={setSearchKeyword}
        onSelectedRoleChange={setSelectedRole}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <ManagerTable
        managers={filteredManagers}
        isLoading={isLoading}
        onDelete={setDeleteTarget}
      />

      <ManagerDeleteModals
        deleteTarget={deleteTarget}
        completeOpen={deleteCompleteOpen}
        onConfirmDelete={deleteManager}
        onCancelDelete={() => setDeleteTarget(null)}
        onCloseComplete={() => setDeleteCompleteOpen(false)}
      />
    </main>
  );
}
