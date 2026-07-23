"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createCommunityComment,
  deleteCommunityComment,
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

const appendReplyToTree = (
  comments: CommunityComment[],
  parentId: number,
  reply: CommunityComment
): CommunityComment[] =>
  comments.map((comment) => {
    if (comment.commentId === parentId) {
      return {
        ...comment,
        replies: [...comment.replies, reply],
      };
    }

    return {
      ...comment,
      replies: appendReplyToTree(comment.replies, parentId, reply),
    };
  });

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
  const [textDialog, setTextDialog] = useState<CommunityCommentTextDialogState>(null);
  const [isReportCompleteOpen, setIsReportCompleteOpen] = useState(false);
  const [isAlreadyReportedOpen, setIsAlreadyReportedOpen] = useState(false);
  const {
    isLoginRequiredOpen,
    openLoginRequiredModal,
    closeLoginRequiredModal,
  } = useLoginRequiredModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const commentCount = useMemo(() => {
    const counted = countComments(comments);
    return counted || initialCommentCount;
  }, [comments, initialCommentCount]);

  // 섹션은 게시글 로드 완료 후에만 마운트되고 이후 initialComments 참조가 바뀌지 않으므로
  // useState 초기값으로 충분하다. (다른 게시글로 전환 시엔 부모가 key로 리마운트)

  const handleCreate = async () => {
    const nextContent = content.trim();
    if (!nextContent || isSubmitting) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    try {
      setIsSubmitting(true);
      const createdComment = await createCommunityComment({
        postId,
        parentId: null,
        content: nextContent,
      });
      setComments((prev) => [...prev, createdComment]);
      onCommentCountChange?.(commentCount + 1);
      setContent("");
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "댓글 등록에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = useCallback(
    async (parentId: number, replyValue: string) => {
      const nextContent = replyValue.trim();
      if (!nextContent || isSubmitting) return;

      if (!currentUserId) {
        openLoginRequiredModal();
        return;
      }

      try {
        setIsSubmitting(true);
        const createdReply = await createCommunityComment({
          postId,
          parentId,
          content: nextContent,
        });
        setComments((prev) => appendReplyToTree(prev, parentId, createdReply));
        onCommentCountChange?.(commentCount + 1);
        setReplyTargetId(null);
      } catch (error) {
        setErrorMessage(getRequestErrorMessage(error, "대댓글 등록에 실패했습니다."));
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      currentUserId,
      openLoginRequiredModal,
      postId,
      commentCount,
      onCommentCountChange,
    ]
  );

  const handleReaction = useCallback(
    async (commentId: number, isLike: boolean) => {
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
    },
    [pendingCommentId, currentUserId, openLoginRequiredModal]
  );

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

  const handleOpenReport = useCallback(
    (commentId: number) => {
      if (!currentUserId) {
        openLoginRequiredModal();
        return;
      }

      setReportTargetId(commentId);
    },
    [currentUserId, openLoginRequiredModal]
  );

  const handleOpenReply = useCallback(
    (commentId: number) => {
      if (!currentUserId) {
        openLoginRequiredModal();
        return;
      }

      setReplyTargetId(commentId);
    },
    [currentUserId, openLoginRequiredModal]
  );

  const handleCancelReply = useCallback(() => {
    setReplyTargetId(null);
  }, []);

  return {
    comments,
    content,
    reactionByCommentId,
    pendingCommentId,
    deleteTargetId,
    reportTargetId,
    replyTargetId,
    textDialog,
    isReportCompleteOpen,
    isAlreadyReportedOpen,
    isLoginRequiredOpen,
    isSubmitting,
    errorMessage,
    commentCount,
    closeLoginRequiredModal,
    setContent,
    setDeleteTargetId,
    setReportTargetId,
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
