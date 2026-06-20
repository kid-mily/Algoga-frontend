"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteAdminComment,
  getAdminUserComments,
} from "@/features/services/adminUserActivity.service";
import { AdminUserComment } from "@/features/csadmin/user/types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useUserCommentList = (userId: number) => {
  const [comments, setComments] = useState<AdminUserComment[]>([]);
  const [selectedComment, setSelectedComment] = useState<AdminUserComment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserComment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const loadComments = async () => {
      try {
        const data = await getAdminUserComments(userId, currentPage, controller.signal);
        if (controller.signal.aborted || requestId !== requestIdRef.current) return;

        setComments(data.items);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalElements);
        setError("");
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setComments([]);
        setTotalPages(1);
        setTotalCount(0);
        setError(getErrorMessage(fetchError, "댓글 목록을 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted && requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    void loadComments();

    return () => controller.abort();
  }, [currentPage, reloadKey, userId]);

  const openCommentDetail = useCallback(async (commentId: number) => {
    setError("");
    setSelectedComment(
      comments.find((comment) => comment.commentId === commentId) ?? null
    );
  }, [comments]);

  const changePage = useCallback((page: number) => {
    setError("");
    setIsLoading(true);
    setCurrentPage(page);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      await deleteAdminComment(deleteTarget.commentId);
      setDeleteTarget(null);
      setIsLoading(true);
      setReloadKey((key) => key + 1);
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError, "댓글 삭제에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  }, [deleteTarget, isProcessing]);

  return {
    comments,
    selectedComment,
    deleteTarget,
    isLoading,
    isProcessing,
    error,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage: changePage,
    setSelectedComment,
    setDeleteTarget,
    openCommentDetail,
    confirmDelete,
  };
};
