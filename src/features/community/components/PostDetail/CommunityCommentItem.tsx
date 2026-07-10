import { Heart, ThumbsDown } from "lucide-react";
import { CommunityCommentItemProps } from '../../types'
import CommentDropdown from "./CommentDropdown";
import CommunityCommentForm from "./CommunityCommentForm";

export default function CommunityCommentItem({
  currentUserId,
  comment,
  reactionByCommentId = {},
  pendingCommentId = null,
  onReact,
  onEdit,
  onDelete,
  onReport,
  onReply,
  activeReplyCommentId = null,
  replyContent = "",
  isReplySubmitting = false,
  canReply = true,
  onReplyContentChange,
  onCancelReply,
  onOpenReply,
}: CommunityCommentItemProps) {
  const isMine = Boolean(
    comment.isMine || (comment.authorId && currentUserId === comment.authorId)
  );
  const reaction = reactionByCommentId[comment.commentId] ?? null;
  const isPending = pendingCommentId === comment.commentId;

  return (
    <div>
      <div className="flex gap-3">
        {comment.authorProfileImageUrl ? (
          <img
            src={comment.authorProfileImageUrl}
            alt={`${comment.authorName} 프로필 이미지`}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
            {comment.authorInitial}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{comment.authorName}</span>
            {isMine && (
              <span className="text-xs font-semibold text-[#6BA19D]">(나)</span>
            )}
            <span className="text-xs text-slate-400">{comment.createdAt}</span>
          </div>

          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
            {comment.content}
          </p>

          <div className="mt-2 flex items-center gap-4 text-xs font-bold text-[#7A6F66]">
            <button
              type="button"
              disabled={isPending}
              onClick={() => onReact(comment.commentId, true)}
              className={`flex cursor-pointer items-center gap-1 disabled:opacity-60 ${
                reaction === true ? "text-[#E05252]" : "hover:text-[#5F928E]"
              }`}
            >
              <Heart size={16} />
              {comment.likeCount.toLocaleString()}
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => onReact(comment.commentId, false)}
              className={`flex cursor-pointer items-center gap-1 disabled:opacity-60 ${
                reaction === false ? "text-[#5F928E]" : "hover:text-[#5F928E]"
              }`}
            >
              <ThumbsDown size={16} />
              {comment.dislikeCount.toLocaleString()}
            </button>

            {canReply && (
              <button
                type="button"
                onClick={() => onOpenReply?.(comment.commentId)}
                className="cursor-pointer hover:text-[#5F928E]"
              >
                답글
              </button>
            )}
          </div>

          {canReply && activeReplyCommentId === comment.commentId && (
            <div className="mt-3 rounded-[14px] bg-[#F8FAFC] p-3">
              <CommunityCommentForm
                value={replyContent}
                placeholder="대댓글을 입력하세요..."
                submitLabel="답글 등록"
                disabled={isReplySubmitting}
                onChange={(value) => onReplyContentChange?.(value)}
                onSubmit={() => onReply(comment.commentId, replyContent)}
              />
              <button
                type="button"
                onClick={onCancelReply}
                className="mt-2 cursor-pointer text-xs font-bold text-[#7A6F66] hover:text-[#5F928E]"
              >
                취소
              </button>
            </div>
          )}
        </div>

        <CommentDropdown
          isMine={isMine}
          onEdit={() => onEdit(comment.commentId, comment.content)}
          onDelete={() => onDelete(comment.commentId)}
          onReport={() => onReport(comment.commentId)}
        />
      </div>

      {comment.replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4 border-l border-[#DDE8EF] pl-4">
          {comment.replies.map((reply) => (
            <CommunityCommentItem
              key={reply.commentId}
              currentUserId={currentUserId}
              comment={reply}
              reactionByCommentId={reactionByCommentId}
              pendingCommentId={pendingCommentId}
              onReact={onReact}
              onEdit={onEdit}
              onDelete={onDelete}
              onReport={onReport}
              onReply={onReply}
              activeReplyCommentId={activeReplyCommentId}
              replyContent={replyContent}
              isReplySubmitting={isReplySubmitting}
              canReply={false}
              onReplyContentChange={onReplyContentChange}
              onCancelReply={onCancelReply}
              onOpenReply={onOpenReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
