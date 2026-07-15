"use client";

import CommunityActionModal from "@/features/community/components/common/CommunityActionModal";
import CommunityCommentForm from "@/features/community/components/PostDetail/CommunityCommentForm";
import CommunityCommentItem from "@/features/community/components/PostDetail/CommunityCommentItem";
import CommunityReportModal from "@/features/community/components/common/CommunityReportModal";
import CommunityReportStatusModals from "@/features/community/components/common/CommunityReportStatusModals";
import { useCommunityComments } from "@/features/community/hooks/useCommunityComments";
import type { CommunityCommentSectionProps } from "../../types";

export default function CommunityCommentSection({
  postId,
  initialCommentCount,
  initialComments = [],
  currentUserId,
  onCommentCountChange,
}: CommunityCommentSectionProps) {
  const {
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
    closeLoginRequiredModal,
    isLoading,
    isSubmitting,
    errorMessage,
    commentCount,
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
  } = useCommunityComments({
    postId,
    initialCommentCount,
    initialComments,
    currentUserId,
    onCommentCountChange,
  });

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

      <CommunityReportStatusModals
        targetLabel="댓글"
        isReportCompleteOpen={isReportCompleteOpen}
        onCloseReportComplete={() => setIsReportCompleteOpen(false)}
        isAlreadyReportedOpen={isAlreadyReportedOpen}
        onCloseAlreadyReported={() => setIsAlreadyReportedOpen(false)}
        isLoginRequiredOpen={isLoginRequiredOpen}
        onCloseLoginRequired={closeLoginRequiredModal}
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
              onReport={handleOpenReport}
              onReply={handleCreateReply}
              activeReplyCommentId={replyTargetId}
              replyContent={replyContent}
              isReplySubmitting={isSubmitting}
              canReply
              onOpenReply={handleOpenReply}
              onCancelReply={handleCancelReply}
              onReplyContentChange={setReplyContent}
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
