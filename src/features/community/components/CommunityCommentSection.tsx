"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import CommunityActionModal from "@/features/community/components/CommunityActionModal";
import CommunityCommentForm from "@/features/community/components/CommunityCommentForm";
import CommunityCommentItem from "@/features/community/components/CommunityCommentItem";
import CommunityReportModal from "@/features/community/components/CommunityReportModal";
import { useLoginRequiredModal } from "@/features/community/hooks/useLoginRequiredModal";
import {
  createCommunityComment,
  deleteCommunityComment,
  getCommunityPost,
  reactToCommunityComment,
  reportCommunityComment,
  updateCommunityComment,
} from "@/features/services/community.service";
import {
  type CommunityComment,
  type CommunityReportReasonType,
  type ReactionState,
} from "../types";

type CommunityCommentSectionProps = {
  postId: number;
  initialCommentCount: number;
  initialComments?: CommunityComment[];
  currentUserId: number | null;
  onCommentCountChange?: (count: number) => void;
};

type TextDialogState =
  | {
      type: "edit";
      commentId: number;
      value: string;
    }
  | null;

const countComments = (comments: CommunityComment[]): number =>
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

export default function CommunityCommentSection({
  postId,
  initialCommentCount,
  initialComments = [],
  currentUserId,
  onCommentCountChange,
}: CommunityCommentSectionProps) {
  const [comments, setComments] = useState<CommunityComment[]>(initialComments);
  const [content, setContent] = useState("");
  const [reactionByCommentId, setReactionByCommentId] = useState<
    Record<number, ReactionState>
  >({});
  const [pendingCommentId, setPendingCommentId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [reportTargetId, setReportTargetId] = useState<number | null>(null);
  const [textDialog, setTextDialog] = useState<TextDialogState>(null);
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

  const refreshCommentsFromPost = async (signal?: AbortSignal) => {
    const post = await getCommunityPost(postId, signal);
    setComments(post.comments);
    onCommentCountChange?.(post.comments.length > 0 ? countComments(post.comments) : post.commentCount);
  };

  useEffect(() => {
    setComments(initialComments);
    setIsLoading(false);
  }, [initialComments]);

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

  return (
    <section className="border-t border-[#CFE0DE] px-7 py-6">
      <CommunityActionModal
        open={Boolean(deleteTargetId)}
        title="댓글 삭제"
        description="삭제한 댓글은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        isPending={isSubmitting}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />

      <CommunityActionModal
        open={isReportCompleteOpen}
        title="댓글 신고 접수"
        description="댓글 신고가 접수되었습니다."
        confirmLabel="확인"
        onConfirm={() => setIsReportCompleteOpen(false)}
      />

      <CommunityActionModal
        open={isAlreadyReportedOpen}
        title="이미 신고한 댓글"
        description="이미 신고한 댓글입니다."
        confirmLabel="확인"
        onConfirm={() => setIsAlreadyReportedOpen(false)}
      />

      <CommunityActionModal
        open={isLoginRequiredOpen}
        title="로그인 필요"
        description="로그인이 필요한 서비스입니다."
        confirmLabel="확인"
        onConfirm={closeLoginRequiredModal}
      />

      <CommunityReportModal
        open={Boolean(reportTargetId)}
        targetType="댓글"
        isPending={isSubmitting}
        onCancel={() => setReportTargetId(null)}
        onSubmit={handleReport}
      />

      {textDialog && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#CFE0DE] bg-[#FFFDF8] p-6 shadow-[0_18px_42px_rgba(47,42,38,0.18)]">
            <h2 className="text-lg font-extrabold text-[#2F2A26]">
              댓글 수정
            </h2>
            <textarea
              value={textDialog.value}
              onChange={(event) =>
                setTextDialog((prev) =>
                  prev ? { ...prev, value: event.target.value } : prev
                )
              }
              maxLength={2000}
              className="mt-4 h-32 w-full resize-none rounded-[12px] border border-[#CFE0DE] bg-white p-4 text-sm text-[#2F2A26] outline-none focus:border-[#6BA19D]"
              placeholder="수정할 댓글을 입력하세요."
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setTextDialog(null)}
                className="h-11 cursor-pointer rounded-[10px] border border-[#CFE0DE] bg-white text-sm font-bold text-[#7A6F66] hover:bg-[#F8F5EF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isSubmitting || !textDialog.value.trim()}
                onClick={handleUpdate}
                className="h-11 cursor-pointer rounded-[10px] bg-[#6BA19D] text-sm font-bold text-white hover:bg-[#5F928E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "처리 중" : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#2F2A26]">
          댓글 {commentCount.toLocaleString()}개
        </h2>
      </div>

      {errorMessage && (
        <p className="mb-4 rounded-[10px] bg-[#EEF4F4] px-4 py-3 text-sm font-semibold text-[#5F928E]">
          {errorMessage}
        </p>
      )}

      <div className="space-y-5">
        {isLoading ? (
          <p className="py-6 text-center text-sm font-semibold text-[#7A6F66]">
            댓글을 불러오는 중입니다.
          </p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommunityCommentItem
              key={comment.commentId}
              currentUserId={currentUserId}
              comment={comment}
              reactionByCommentId={reactionByCommentId}
              pendingCommentId={pendingCommentId}
              onReact={handleReaction}
              onEdit={(commentId, currentContent) =>
                setTextDialog({
                  type: "edit",
                  commentId,
                  value: currentContent,
                })
              }
              onDelete={setDeleteTargetId}
              onReport={(commentId) => {
                if (!currentUserId) {
                  openLoginRequiredModal();
                  return;
                }

                setReportTargetId(commentId);
              }}
            />
          ))
        ) : (
          <p className="py-6 text-center text-sm font-semibold text-[#7A6F66]">
            아직 등록된 댓글이 없습니다.
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-[#DDE8EF] pt-5">
        <CommunityCommentForm
          value={content}
          disabled={isSubmitting}
          onChange={setContent}
          onSubmit={handleCreate}
        />
      </div>
    </section>
  );
}
