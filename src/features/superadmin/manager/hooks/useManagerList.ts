import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAdminManager,
  getAdminManagers,
} from "@/features/services/adminManager.service";
import { getCurrentAdminPayload, hasAdminRole } from "@/lib/adminToken";
import { AdminManager, ManagerRole } from "../types";

export const useManagerList = (initialManagers: AdminManager[]) => {
  const [managers, setManagers] = useState<AdminManager[]>(initialManagers);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState<ManagerRole | "ALL">("ALL");
  const [deleteTarget, setDeleteTarget] = useState<AdminManager | null>(null);
  const [deleteCompleteOpen, setDeleteCompleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchManagers = useCallback(
    async (signal?: AbortSignal) => {
      const adminPayload = getCurrentAdminPayload();

      if (!hasAdminRole(adminPayload, ["SUPER_ADMIN"])) {
        setManagers(initialManagers);
        setError(
          "슈퍼 관리자 권한으로 로그인해야 관리자 계정 API를 호출할 수 있습니다. 임시 데이터를 표시합니다."
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminManagers(searchKeyword, signal);

        if (signal?.aborted) return;

        setManagers(data);
      } catch (fetchError: unknown) {
        if (signal?.aborted) return;

        setManagers(initialManagers);
        setError(
          fetchError instanceof Error
            ? `${fetchError.message} 임시 데이터를 표시합니다.`
            : "관리자 계정 목록을 불러오지 못했습니다."
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [initialManagers, searchKeyword]
  );

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void fetchManagers(controller.signal);
      }
    });

    return () => controller.abort();
  }, [fetchManagers]);

  const filteredManagers = useMemo(() => {
    return managers.filter((manager) => {
      const roleMatched = selectedRole === "ALL" || manager.role === selectedRole;
      const keyword = searchKeyword.trim().toLowerCase();
      const keywordMatched =
        !keyword ||
        manager.name.toLowerCase().includes(keyword) ||
        manager.loginId.toLowerCase().includes(keyword) ||
        manager.displayId.toLowerCase().includes(keyword);

      return roleMatched && keywordMatched;
    });
  }, [managers, searchKeyword, selectedRole]);

  const deleteManager = async () => {
    if (!deleteTarget) return;

    try {
      setError("");
      await deleteAdminManager(deleteTarget.managerId);
      setManagers((prev) =>
        prev.filter((manager) => manager.managerId !== deleteTarget.managerId)
      );
      setDeleteTarget(null);
      setDeleteCompleteOpen(true);
    } catch (deleteError: unknown) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "관리자 계정 삭제에 실패했습니다."
      );
    }
  };

  return {
    searchKeyword,
    selectedRole,
    filteredManagers,
    totalCount: managers.length,
    deleteTarget,
    deleteCompleteOpen,
    isLoading,
    error,
    setSearchKeyword,
    setSelectedRole,
    setDeleteTarget,
    setDeleteCompleteOpen,
    deleteManager,
  };
};
