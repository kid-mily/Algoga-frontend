"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createCommunityComment,
  deleteCommunityComment,
  getCommunityPost,
  reactToCommunityComment,
  reportCommunityComment,
  updateCommunityComment,
} from "@/features/services/community.service";
import { useLoginRequiredModal } from "@/features/community/hooks/useLoginRequiredModal";
import {
  getRequestErrorMessage,
  isAlreadyReportedError,
} from "@/features/community/utils/communityErrors";
import type {
  CommunityComment,
  CommunityCommentSectionProps,
  CommunityCommentTextDialogState,
  CommunityReportReasonType,
  ReactionState,
} from "@/features/community/types";

export const countComments = (comments: CommunityComment[]): number =>
  comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0);

const updateCommentInTree = (
  comments: CommunityComment[],
  commentId: number,
  updater: (comment: CommunityComment) => CommunityComment
): CommunityComment[] =>
  comments.map((comment) => {
    if (comment.commentId === commentId) {
      return updater(comment);
    }

    return {
      ...comment,
      replies: updateCommentInTree(comment.replies, commentId, updater),
    };
  });

const removeCommentFromTree = (
  comments: CommunityComment[],
  commentId: number
): CommunityComment[] =>
  comments
    .filter((comment) => comment.commentId !== commentId)
    .map((comment) => ({
      ...comment,
      replies: removeCommentFromTree(comment.replies, commentId),
    }));

export const useCommunityComments = ({
  postId,
  initialCommentCount,
  initialComments = [],
  currentUserId,
  onCommentCountChange,
}: CommunityCommentSectionProps) => {
  const [comments, setComments] = useState<CommunityComment[]>(initialComments);
  const [content, setContent] = useState("");
  const [reactionByCommentId, setReactionByCommentId] = useState<
    Record<number, ReactionState>
  >({});
  const [pendingCommentId, setPendingCommentId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [reportTargetId, setReportTargetId] = useState<number | null>(null);
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [textDialog, setTextDialog] = useState<CommunityCommentTextDialogState>(null);
  const [isReportCompleteOpen, setIsReportCompleteOpen] = useState(false);
  const [isAlreadyReportedOpen, setIsAlreadyReportedOpen] = useState(false);
  const {
    isLoginRequiredOpen,
    openLoginRequiredModal,
    closeLoginRequiredModal,
  } = useLoginRequiredModal();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const commentCount = useMemo(() => {
    const counted = countComments(comments);
    return counted || initialCommentCount;
  }, [comments, initialCommentCount]);

  useEffect(() => {
    setComments(initialComments);
    setIsLoading(false);
  }, [initialComments]);

  const refreshCommentsFromPost = async (signal?: AbortSignal) => {
    const post = await getCommunityPost(postId, signal);
    setComments(post.comments);
    onCommentCountChange?.(
      post.comments.length > 0 ? countComments(post.comments) : post.commentCount
    );
  };

  const handleCreate = async () => {
    const nextContent = content.trim();
    if (!nextContent || isSubmitting) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    try {
      setIsSubmitting(true);
      await createCommunityComment({
        postId,
        parentId: null,
        content: nextContent,
      });
      setContent("");
      await refreshCommentsFromPost();
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "댓글 등록에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async (parentId: number, replyValue: string) => {
    const nextContent = replyValue.trim();
    if (!nextContent || isSubmitting) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    try {
      setIsSubmitting(true);
      await createCommunityComment({
        postId,
        parentId,
        content: nextContent,
      });
      setReplyTargetId(null);
      setReplyContent("");
      await refreshCommentsFromPost();
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "대댓글 등록에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (commentId: number, isLike: boolean) => {
    if (pendingCommentId) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    try {
      setPendingCommentId(commentId);
      const result = await reactToCommunityComment({ commentId, isLike });

      setComments((prev) =>
        updateCommentInTree(prev, commentId, (comment) => ({
          ...comment,
          likeCount: result.likeCount,
          dislikeCount: result.dislikeCount,
        }))
      );
      setReactionByCommentId((prev) => ({
        ...prev,
        [commentId]: result.status === "REMOVED" ? null : isLike,
      }));
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "댓글 반응 처리에 실패했습니다."));
    } finally {
      setPendingCommentId(null);
    }
  };

  const handleUpdate = async () => {
    if (!textDialog || textDialog.type !== "edit") return;
    const nextContent = textDialog.value.trim();
    if (!nextContent) return;

    try {
      setIsSubmitting(true);
      await updateCommunityComment({
        commentId: textDialog.commentId,
        content: nextContent,
      });
      setComments((prev) =>
        updateCommentInTree(prev, textDialog.commentId, (comment) => ({
          ...comment,
          content: nextContent,
        }))
      );
      setTextDialog(null);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "댓글 수정에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setIsSubmitting(true);
      await deleteCommunityComment(deleteTargetId);
      const nextComments = removeCommentFromTree(comments, deleteTargetId);
      setComments(nextComments);
      onCommentCountChange?.(countComments(nextComments));
      setDeleteTargetId(null);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "댓글 삭제에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async ({
    reasonType,
    detail,
  }: {
    reasonType: CommunityReportReasonType;
    detail: string;
  }) => {
    if (!reportTargetId || !detail.trim()) return;
    if (!currentUserId) {
      setReportTargetId(null);
      openLoginRequiredModal();
      return;
    }

    try {
      setIsSubmitting(true);
      await reportCommunityComment({
        commentId: reportTargetId,
        reasonType,
        detail,
      });
      setReportTargetId(null);
      setErrorMessage("");
      setIsReportCompleteOpen(true);
    } catch (error) {
      if (isAlreadyReportedError(error)) {
        setReportTargetId(null);
        setErrorMessage("");
        setIsAlreadyReportedOpen(true);
        return;
      }

      setErrorMessage(getRequestErrorMessage(error, "댓글 신고에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReport = (commentId: number) => {
    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    setReportTargetId(commentId);
  };

  const handleOpenReply = (commentId: number) => {
    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    setReplyTargetId(commentId);
    setReplyContent("");
  };

  const handleCancelReply = () => {
    setReplyTargetId(null);
    setReplyContent("");
  };

  return {
    comments,
    content,
    reactionByCommentId,
    pendingCommentId,
    deleteTargetId,
    reportTargetId,
    replyTargetId,
    replyContent,
    textDialog,
    isReportCompleteOpen,
    isAlreadyReportedOpen,
    isLoginRequiredOpen,
    isLoading,
    isSubmitting,
    errorMessage,
    commentCount,
    closeLoginRequiredModal,
    setContent,
    setDeleteTargetId,
    setReportTargetId,
    setReplyContent,
    setTextDialog,
    setIsReportCompleteOpen,
    setIsAlreadyReportedOpen,
    handleCreate,
    handleCreateReply,
    handleReaction,
    handleUpdate,
    handleDelete,
    handleReport,
    handleOpenReport,
    handleOpenReply,
    handleCancelReply,
  };
};
