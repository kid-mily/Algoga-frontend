"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteAdminNotice, getAdminNotices } from "@/features/services/adminNotice.service";
import { AdminNotice, NoticeTag } from "../types";

export const useAdminNoticeList = (initialNotices: AdminNotice[]) => {
  const [notices, setNotices] = useState<AdminNotice[]>(initialNotices);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTag, setSelectedTag] = useState<NoticeTag>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const fetchNotices = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getAdminNotices({ tag: selectedTag, index: 0, signal });

      if (signal?.aborted) return;

      setNotices(data);
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "공지사항 목록을 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [selectedTag]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void fetchNotices(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchNotices]);

  const filteredNotices = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return notices;

    return notices.filter((notice) => {
      return (
        notice.title.toLowerCase().includes(keyword) ||
        notice.content.toLowerCase().includes(keyword) ||
        notice.displayId.toLowerCase().includes(keyword)
      );
    });
  }, [notices, searchKeyword]);

  const openDeleteModal = (noticeId: number) => {
    setDeleteTargetId(noticeId);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
  };

  const deleteNotice = async () => {
    if (!deleteTargetId) return;

    try {
      setError("");
      await deleteAdminNotice(deleteTargetId);
      setNotices((prev) =>
        prev.filter((notice) => notice.noticeId !== deleteTargetId)
      );
      setDeleteTargetId(null);
      setNoticeMessage("공지사항이 삭제되었습니다.");
    } catch (deleteError: unknown) {
      setDeleteTargetId(null);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "공지사항 삭제에 실패했습니다."
      );
    }
  };

  return {
    searchKeyword,
    selectedTag,
    filteredNotices,
    totalCount: notices.length,
    isLoading,
    error,
    noticeMessage,
    deleteTargetId,
    setSearchKeyword,
    setSelectedTag,
    setNoticeMessage,
    openDeleteModal,
    closeDeleteModal,
    deleteNotice,
  };
};
