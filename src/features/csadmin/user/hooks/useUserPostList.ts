"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteAdminPost,
  getAdminPostDetail,
  getAdminUserPosts,
} from "@/features/services/adminUserActivity.service";
import { AdminUserPost } from "@/features/csadmin/user/types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useUserPostList = (userId: number) => {
  const [posts, setPosts] = useState<AdminUserPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<AdminUserPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserPost | null>(null);
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

    const loadPosts = async () => {
      try {
        const data = await getAdminUserPosts(userId, currentPage, controller.signal);
        if (controller.signal.aborted || requestId !== requestIdRef.current) return;

        setPosts(data.items);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalElements);
        setError("");
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setPosts([]);
        setTotalPages(1);
        setTotalCount(0);
        setError(getErrorMessage(fetchError, "게시글 목록을 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted && requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    void loadPosts();

    return () => controller.abort();
  }, [currentPage, reloadKey, userId]);

  const openPostDetail = useCallback(async (postId: number) => {
    const controller = new AbortController();
    setError("");

    try {
      const post = await getAdminPostDetail(postId, controller.signal);
      setSelectedPost(post);
    } catch (detailError: unknown) {
      setError(getErrorMessage(detailError, "게시글 상세 정보를 불러오지 못했습니다."));
    }
  }, []);

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
      await deleteAdminPost(deleteTarget.postId);
      setDeleteTarget(null);
      setIsLoading(true);
      setReloadKey((key) => key + 1);
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError, "게시글 삭제에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  }, [deleteTarget, isProcessing]);

  return {
    posts,
    selectedPost,
    deleteTarget,
    isLoading,
    isProcessing,
    error,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage: changePage,
    setSelectedPost,
    setDeleteTarget,
    openPostDetail,
    confirmDelete,
  };
};
