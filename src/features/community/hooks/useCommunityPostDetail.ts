"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { useLoginRequiredModal } from "@/features/community/hooks/useLoginRequiredModal";
import {
  deleteCommunityPost,
  getCommunityPost,
  reactToCommunityPost,
  reportCommunityPost,
} from "@/features/services/community.service";
import { getMe } from "@/features/services/user.service";
import type {
  CommunityPost,
  CommunityReportReasonType,
  ReactionState,
} from "@/features/community/types";

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

const isAlreadyReportedError = (error: unknown) => {
  const message = getRequestErrorMessage(error, "");
  const code = error instanceof ApiRequestError ? error.code ?? "" : "";

  return (
    (error instanceof ApiRequestError && error.status === 409) ||
    message.includes("이미 신고") ||
    code.includes("ALREADY_REPORTED")
  );
};

export const useCommunityPostDetail = (postId: number) => {
  const router = useRouter();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [reaction, setReaction] = useState<ReactionState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReacting, setIsReacting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteCompleteOpen, setIsDeleteCompleteOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportCompleteOpen, setIsReportCompleteOpen] = useState(false);
  const [isAlreadyReportedOpen, setIsAlreadyReportedOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserProfileImageUrl, setCurrentUserProfileImageUrl] = useState<
    string | null
  >(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    isLoginRequiredOpen,
    openLoginRequiredModal,
    closeLoginRequiredModal,
  } = useLoginRequiredModal();

  const isInvalidPostId = !Number.isFinite(postId) || postId <= 0;
  const isOwnPost = Boolean(
    post && (post.isMine || (post.authorId && currentUserId === post.authorId))
  );
  const authorProfileImageUrl =
    post?.authorProfileImageUrl || (isOwnPost ? currentUserProfileImageUrl : null);
  const postImages = post?.imageUrls ?? [];

  useEffect(() => {
    if (isInvalidPostId) return;

    const controller = new AbortController();
    const loadPost = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [data, user] = await Promise.all([
          getCommunityPost(postId, controller.signal),
          getMe(controller.signal),
        ]);

        setPost(data);
        setCurrentImageIndex(0);
        setCurrentUserId(user?.userId ?? null);
        setCurrentUserProfileImageUrl(user?.profileImageUrl ?? null);
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(
          error instanceof Error ? error.message : "게시글을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      controller.abort();
    };
  }, [isInvalidPostId, postId]);

  const handleBackToList = () => {
    router.push("/community");
  };

  const handleReaction = async (isLike: boolean) => {
    if (!post || isReacting) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    try {
      setIsReacting(true);
      const result = await reactToCommunityPost({
        postId: post.postId,
        isLike,
      });

      setPost((prev) =>
        prev
          ? {
              ...prev,
              likeCount: result.likeCount,
              dislikeCount: result.dislikeCount,
            }
          : prev
      );
      setReaction(result.status === "REMOVED" ? null : isLike);
    } catch (error) {
      console.error("[community] reaction failed", error);

      if (error instanceof ApiRequestError && error.status === 401) {
        openLoginRequiredModal();
        return;
      }

      if (error instanceof ApiRequestError && error.status === 403) {
        window.alert("이 게시글에 반응할 권한이 없습니다.");
        return;
      }

      window.alert(getRequestErrorMessage(error, "반응 처리에 실패했습니다."));
    } finally {
      setIsReacting(false);
    }
  };

  const handleOpenReport = () => {
    if (!post || isReporting) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    setIsReportModalOpen(true);
  };

  const handleReport = async ({
    reasonType,
    detail,
  }: {
    reasonType: CommunityReportReasonType;
    detail: string;
  }) => {
    if (!post || isReporting || !detail.trim()) return;

    try {
      setIsReporting(true);
      await reportCommunityPost({
        postId: post.postId,
        reasonType,
        detail,
      });
      setIsReportModalOpen(false);
      setIsReportCompleteOpen(true);
    } catch (error) {
      if (isAlreadyReportedError(error)) {
        setIsReportModalOpen(false);
        setIsAlreadyReportedOpen(true);
        return;
      }

      console.error("[community] report failed", error);
      window.alert(getRequestErrorMessage(error, "신고 접수에 실패했습니다."));
    } finally {
      setIsReporting(false);
    }
  };

  const handleEdit = () => {
    if (!post) return;

    router.push(`/community/write?postId=${post.postId}`);
  };

  const handleDelete = async () => {
    if (!post || isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteCommunityPost(post.postId);
      setIsDeleteConfirmOpen(false);
      setIsDeleteCompleteOpen(true);
    } catch (error) {
      window.alert(getRequestErrorMessage(error, "게시글 삭제에 실패했습니다."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrevImage = () => {
    if (!postImages.length) return;

    setCurrentImageIndex((prev) =>
      prev === 0 ? postImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!postImages.length) return;

    setCurrentImageIndex((prev) =>
      prev === postImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleCommentCountChange = (count: number) => {
    setPost((prev) =>
      prev
        ? {
            ...prev,
            commentCount: count,
          }
        : prev
    );
  };

  return {
    post,
    reaction,
    isLoading,
    isReacting,
    isReporting,
    isDeleting,
    isDeleteConfirmOpen,
    isDeleteCompleteOpen,
    isReportModalOpen,
    isReportCompleteOpen,
    isAlreadyReportedOpen,
    isLoginRequiredOpen,
    currentUserId,
    currentImageIndex,
    errorMessage,
    isInvalidPostId,
    isOwnPost,
    authorProfileImageUrl,
    closeLoginRequiredModal,
    setIsDeleteConfirmOpen,
    setIsDeleteCompleteOpen,
    setIsReportModalOpen,
    setIsReportCompleteOpen,
    setIsAlreadyReportedOpen,
    handleBackToList,
    handleReaction,
    handleOpenReport,
    handleReport,
    handleEdit,
    handleDelete,
    handlePrevImage,
    handleNextImage,
    handleCommentCountChange,
  };
};
