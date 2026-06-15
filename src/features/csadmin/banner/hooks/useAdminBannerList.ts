"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAdminBanner,
  getAdminBanners,
} from "@/features/services/adminBanner.service";
import { AdminBanner } from "../types";

export const useAdminBannerList = (initialBanners: AdminBanner[] = []) => {
  const [banners, setBanners] = useState<AdminBanner[]>(initialBanners);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"ALL" | "VISIBLE" | "HIDDEN">("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const fetchBanners = useCallback(async (signal?: AbortSignal) => {
    await Promise.resolve();

    try {
      setIsLoading(true);
      setError("");
      const data = await getAdminBanners(signal);

      if (signal?.aborted) return;

      setBanners(data);
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "배너 목록을 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      await fetchBanners(controller.signal);
    })();

    return () => {
      controller.abort();
    };
  }, [fetchBanners]);

  const filteredBanners = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return banners.filter((banner) => {
      const matchesKeyword =
        !keyword ||
        banner.text.toLowerCase().includes(keyword) ||
        banner.linkUrl.toLowerCase().includes(keyword) ||
        banner.displayId.toLowerCase().includes(keyword);
      const matchesVisibility =
        visibilityFilter === "ALL" ||
        (visibilityFilter === "VISIBLE" && banner.isVisible) ||
        (visibilityFilter === "HIDDEN" && !banner.isVisible);

      return matchesKeyword && matchesVisibility;
    });
  }, [banners, searchKeyword, visibilityFilter]);

  const activeCount = useMemo(
    () => banners.filter((banner) => banner.isVisible).length,
    [banners]
  );

  const openDeleteModal = (bannerId: number) => {
    setDeleteTargetId(bannerId);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
  };

  const deleteBanner = async () => {
    if (!deleteTargetId) return;

    try {
      setError("");
      await deleteAdminBanner(deleteTargetId);
      setBanners((prev) =>
        prev.filter((banner) => banner.bannerId !== deleteTargetId)
      );
      setDeleteTargetId(null);
      setMessage("배너가 삭제되었습니다.");
    } catch (deleteError: unknown) {
      setDeleteTargetId(null);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "배너 삭제에 실패했습니다."
      );
    }
  };

  return {
    searchKeyword,
    visibilityFilter,
    filteredBanners,
    totalCount: banners.length,
    activeCount,
    isLoading,
    error,
    message,
    deleteTargetId,
    setSearchKeyword,
    setVisibilityFilter,
    setMessage,
    openDeleteModal,
    closeDeleteModal,
    deleteBanner,
  };
};
